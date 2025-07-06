import mongoose from 'mongoose'

type connectionObject = {
    isConnected?: number
}

const connection: connectionObject = {}

async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log("Already Connected to database")
        return;
    }
    
    try {
        const db = await mongoose.connect("mongodb+srv://ritikroshanyadav9696:rascal1234@cluster0.lokbk.mongodb.net/AnonymousMessage")
        connection.isConnected = db.connections[0].readyState
        console.log("db connected successfully")
    }
    catch (error) {
        console.error("database Connection failed", error)
        throw error; // Don't exit process, let the calling function handle it
    }
}

export default dbConnect;