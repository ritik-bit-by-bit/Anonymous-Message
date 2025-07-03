import dbConnect from "@/lib/dbConnect";
import { z } from "zod";
import UserModel from "@/model/user";
import { useRouter } from "next/router";

export async function POST(request:Request){
    await dbConnect();
   try {
    const {username , code } = await request.json();
   const decodedUsername= decodeURIComponent(username);
   const user =await UserModel.findOne({username:decodedUsername});
   if(!user){
    return Response.json({
        success:false,
        message:"User not found"
    },{
        status:404
    })

   }
   const isCodeValid = user.verifyCode === code;
   const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();
   if(!isCodeValid || !isCodeNotExpired){
    return Response.json({
        success:false,
        message:"Invalid code or code has expired"
    },{
        status:400
    })

   }
   else{
    user.isVerified=true;
    await user.save();
    return Response.json({
        success:true,
        message:"Email verified successfully"
    },{
        status:200
    }) 
   }
 } catch (error) {
    console.log(error);
    return Response.json({
    success:false,
    message:"Error verifying code"
    },{
        status:500
    })
   }

}

