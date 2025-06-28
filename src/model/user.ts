import mongoose,{Schema,Document} from "mongoose";

export interface Message extends Document{
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
        default:false
    },
    messages:[messageSchema]
})

const UserModel =(mongoose.models.User as mongoose.Model<User> || mongoose.model<User>("User",UserSchema))
export default UserModel;