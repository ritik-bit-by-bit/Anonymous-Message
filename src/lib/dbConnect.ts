import mongoose, { Promise } from 'mongoose'

type connectionObject ={
    isConnected ?:number
}

const connection : connectionObject = {}

async function dbConnect():Promise<void>{
    if(connection.isConnected){
        console.log("Already Connected to database")
    }
    try{
    const db =await mongoose.connect("mongodb+srv://ritikroshanyadav9696:rascal1234@cluster0.lokbk.mongodb.net/")
    connection.isConnected=db.connections[0].readyState
    console.log("db connected successfully")
    }
    catch(error){
        console.log("database COnnection failed",error)
    process.exit(1);
    }
    
}
export default dbConnect;