import mongoose,{Schema,Document} from "mongoose";

export interface Message extends Document{
    _id:string,
    content : string,
    createdAt:Date
}

const messageSchema : Schema<Message>= new Schema({
    content:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now
    }
})
export interface User extends Document{
  username :string,
  email:string,
  password:string,
  verifyCode:string,
  verifyCodeExpiry:Date,
  isVerified:boolean,
  isAcceptingMessage:boolean,
  messages:Message[]
}

const UserSchema : Schema<User>= new Schema({
    username:{
        type:String,
        trim:true,
        unique:true,
        required:[true,"Username is required"]
    },
    email:{
        type:String,
        unique:true,
        required:[true,"Email is required"],
        match:[
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please add a valid email"
        ]
    },
    password:{
        type:String,
        required:true
    },
    isVerified:{
        type:Boolean,
        required:true,
        default:false
    },
    verifyCode:{
        type:String,
        required:true
    },
    verifyCodeExpiry:{
        type:Date,
        required:true
    },
    isAcceptingMessage:{
        type:Boolean,
        required:true,
        default:true
    },
    messages:[messageSchema]
})

// Check if the model already exists to prevent recompilation
const UserModel = mongoose.models.AnnonymousMessageUser || mongoose.model<User>("AnnonymousMessageUser", UserSchema);
export default UserModel;