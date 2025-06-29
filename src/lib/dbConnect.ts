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
    const db =await mongoose.connect(process.env.MONGODB_URI || ' ',{})
    connection.isConnected=db.connections[0].readyState
    console.log("db connected successfully")
    }
    catch(error){
    process.exit(1);
    console.log("database COnnection failed",error)
    }
    
}
export default dbConnect;