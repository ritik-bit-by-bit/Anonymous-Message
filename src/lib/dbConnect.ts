import mongoose from 'mongoose'

type connectionObject = {
    isConnected?: number
}
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const connection: connectionObject = {}

async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log("Already Connected to database")
        return;
    }
    
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI!)
        connection.isConnected = db.connections[0].readyState
        console.log("db connected successfully")
    }
    catch (error) {
        console.error("database Connection failed", error)
        throw error; // Don't exit process, let the calling function handle it
    }
}

export default dbConnect;