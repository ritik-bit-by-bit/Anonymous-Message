import {NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id:"credentials",
            name: "Credentials",
            credentials: {
                Email: { label: "Email", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
              },
              async authorize(credentials, req): Promise<any> {
                await dbConnect()
                try {
                 const user= await UserModel.findOne({
                    $or:[
                        {email:credentials?.Email},
                    ]
                   })
                   if(!user){
                    throw new Error("No user found")
                   }
                   if(!user.isVerified){
                    throw new Error("Please verify your account")
                   }
                 const passwordMatch =  await bcrypt.compare(credentials?.password as string,user.password)
                 if(!passwordMatch){
                    throw new Error("Invalid credentials")
                 }
                 else{
                    return user;
                 }
                   
                } catch (error) {
                    throw new Error("Something went wrong")
                }
            }
        })       
    ],
    pages:{
        signIn:"/sign-in",
        error:"/login",
        signOut:"/",
    },
    session:{
        strategy:"jwt"
    },
    secret:process.env.NEXTAUTH_SECRET,
    callbacks:{
        async session({ session,token }) {
            if(token){
                session.user._id=token._id;
                session.user.isVerified=token.isVerified;
                session.user.isAcceptingMessage=token.isAcceptingMessage;
                session.user.username=token.username;
            }
            return session
          },
          async jwt({ token, user}) {
            if (user) {
              token._id = user._id?.toString();
              token.isVerified = user.isVerified;
              token.isAcceptingMessage = user.isAcceptingMessages;
              token.username = user.username;
            }
            return token
          }
    }
}