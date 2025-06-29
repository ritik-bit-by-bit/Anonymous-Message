import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import bcrypt from "bcryptjs";
import { sendVerificationEmails } from "@/helpers/SendVerificationEmails";
export async function POST(request: Request) {
    await dbConnect();
    try {
        const { username, email, password } = await request.json();
        return Response.json({
            success: true})
    } catch (error) {
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