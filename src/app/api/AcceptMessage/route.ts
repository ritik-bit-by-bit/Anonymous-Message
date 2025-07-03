import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { User } from "next-auth";

export async function POST(request: Request) {
    dbConnect();

 const session=await  getServerSession(authOptions);
 const user =session?.user as User;
 if(!session || !session.user){
    return Response.json({
        success:false,
        message:"Unauthorized"
    },{
  status:401
    })
 }
    const userId=user._id
}