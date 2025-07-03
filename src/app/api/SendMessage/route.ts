import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { MessageSchema } from "@/Schemas/messageSchema";
import {Message} from "@/model/user"



export async function POST(request:Request){
   await dbConnect();
   const {username,content} = await request.json();
   try {
    const user =await UserModel.findOne({username});
    if(!user){
        return Response.json({
            success:false,
            message:"user not found"
        },{
            status:404
        
        })
        
      } 
      else{
        if(!user.isAcceptingMessage){
            return Response.json({
                success:false,
                message:"user is not accepting messages"
            },{
                status:400
            })
        }
        else{
            const newMessage ={
                content:content,
                createdAt:new Date()
            }
            user.messages.push(newMessage as Message);
            await user.save();
            return Response.json({
                success:true,
                message:"message sent"
            },{
                status:200
            })  
        }
      }
    }catch (error) {
    console.log(error);
    return Response.json({
        success:false,
        message:"something went wrong"
    },{
        status:500
    })
   }
}
