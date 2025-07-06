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
                identifier: { label: "Email/Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
              },
              async authorize(credentials, req): Promise<any> {
                console.log("NextAuth authorize called with:", { 
                  identifier: credentials?.identifier,
                  password: credentials?.password ? "***" : "undefined"
                });
                
                try {
                  await dbConnect();
                  console.log("Database connected successfully");
                  
                  const user = await UserModel.findOne({
                    $or:[
                        {email:credentials?.identifier},
                        {username:credentials?.identifier}
                    ]
                  });
                  
                  console.log("User lookup result:", user ? { 
                    id: user._id, 
                    username: user.username, 
                    email: user.email, 
                    isVerified: user.isVerified 
                  } : "No user found");
                  
                  if(!user){
                    console.log("No user found");
                    throw new Error("No user found")
                  }
                  
                  if(!user.isVerified){
                    console.log("User not verified");
                    throw new Error("Please verify your account")
                  }
                  
                  console.log("Checking password...");
                  const passwordMatch = await bcrypt.compare(credentials?.password as string, user.password);
                  console.log("Password match result:", passwordMatch);
                  
                  if(!passwordMatch){
                    console.log("Password mismatch");
                    throw new Error("Invalid credentials")
                  }
                  
                  console.log("Authentication successful, returning user");
                  return user;
                   
                } catch (error) {
                  console.error("NextAuth authorize error:", error);
                  throw error;
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
    secret: process.env.NEXTAUTH_SECRET || "your-secret-key-here",
    callbacks:{
        async session({ session,token }) {
            if(token){
                session.user._id=token._id;
                session.user.isVerified=token.isVerified;
                session.user.isAcceptingMessages=token.isAcceptingMessage;
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