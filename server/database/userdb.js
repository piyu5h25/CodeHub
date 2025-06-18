import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const MONGO_URI = process.env.MONGO_URL;

const connectDB = async () => {


    if(!MONGO_URI) {
        console.error("MONGO_URI is not defined in the environment variables");
        process.exit(1);
    }
    try {
        await mongoose.connect(MONGO_URI); 
        console.log("Connected to MongoDB");
        
        
    } catch (error) {
        console.error("Error connecting to MongoDB", error);
        process.exit(1);
    }

};

export default connectDB;