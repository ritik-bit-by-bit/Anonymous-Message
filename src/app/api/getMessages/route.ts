import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user =session?.user;
 if(!session || !session.user){
    return Response.json({
        success:false,
        message:"Unauthorized"
    },{
  status:401
    })
 }
 const userId = typeof user._id === "string" ? new mongoose.Types.ObjectId(user._id) : user._id;
 try {
    const user = 
 } catch (error) {
    
 }
 
}