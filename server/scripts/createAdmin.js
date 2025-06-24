import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URL;
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD ;

const createAdminUser = async () => {
    try {
        if (!MONGO_URI) {
            console.error("MONGO_URL is not defined in environment variables");
            process.exit(1);
        }
        
        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB successfully");
        
        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminEmail });
        
        if (existingAdmin) {
            console.log("Admin user already exists!");
            return;
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(adminPassword, 12);
        
        // Create admin user
        const adminUser = await User.create({
            firstName: "Admin",
            lastName: "User",
            email: adminEmail,
            password: hashedPassword,
            role: "admin"
        });
        
        console.log("Admin user created successfully!");
        console.log("Email:", adminUser.email);
        console.log("Role:", adminUser.role);
        console.log("Password:", adminPassword);
        
    } catch (error) {
        console.error("Error creating admin user:", error);
    } 
};

createAdminUser(); 