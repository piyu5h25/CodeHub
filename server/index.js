import express from "express";
import dotenv from "dotenv";
import connectDB from "./database/userdb.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";
import User from "./models/User.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import submitRoutes from "./routes/submitRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";  
import aiRoutes from "./routes/aiRoutes.js";
import problemRoutes from "./routes/problemRoutes.js";


dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

connectDB();
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/", authRoutes);
app.use("/problems", problemRoutes);
app.use("/submit", submitRoutes);
app.use("/leaderboard", leaderboardRoutes);
app.use("/ai-review", aiRoutes);
app.get("/", (req, res) => {
    res.send("Hello World");
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Access the server at: ${process.env.BACKEND_URL}`);
    console.log(`Access the login page at: ${process.env.BACKEND_URL}/login`);
    console.log(`Access the register page at: ${process.env.BACKEND_URL}/register`);
    console.log(`Access the leaderboard page at: ${process.env.BACKEND_URL}/leaderboard`);
    console.log(`Access the problems page at: ${process.env.BACKEND_URL}/problems`);
    console.log(`Access the compiler page at: ${process.env.BACKEND_URL}/compiler`);
    console.log(`Access the terms page at: ${process.env.BACKEND_URL}/terms`);
    console.log(`Access the privacy page at: ${process.env.BACKEND_URL}/privacy`);
});