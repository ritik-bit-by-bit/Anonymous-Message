import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/SendVerificationEmails";
export async function POST(request: Request) {
    await dbConnect();
    try {
        const { username, email, password } = await request.json();
        
       const existingUserVerfiedByusername= await UserModel.findOne({
            username,
            isVerified: true,
        })
        if(existingUserVerfiedByusername){
            return Response.json({
                success:false,
                message:"Username is already taken"
            },{
                status:400
            })
        }
        const existingUserVerfiedByEmail = await UserModel.findOne({
            email
        })
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if(existingUserVerfiedByEmail){
           if(existingUserVerfiedByEmail.isVerified){ return Response.json({
                success:false,
                message:"Email is already taken"  },{
                status:400
            })  }
            else{
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserVerfiedByEmail.password=hashedPassword;
                existingUserVerfiedByEmail.verifyCode=verifyCode;
                existingUserVerfiedByEmail.verifyCodeExpiry=new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);
                await existingUserVerfiedByEmail.save();
            }
        }
        else{
          const hashedPassword = await bcrypt.hash(password, 10);
          const expiryDate = new Date();
          expiryDate.setDate(expiryDate.getDate() + 1);
          
            const newUser = new UserModel({
                username: username,
                email: email,
                password: hashedPassword,
                verifyCode: verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
          })
          await newUser.save();
        }
         const emailResponse= await sendVerificationEmail(email,username,verifyCode);
         if(!emailResponse.success){
           return Response.json({
            success:false,
            message:emailResponse.message
           },{
            status:500
           })
         }
         return Response.json({
            success:true,
            message:"User registered successfully"
         },{
            status:201
         })
        }
     catch (error) {
        console.error('Error registering new user:', error);
        return Response.json({ 
            success: false,
            error: 'Error registering new user' 
        },{
            status: 500
        }
    );
    
    }
}