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
app.get("/", (req, res) => {
    res.send("Hello World");
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Access the server at: http://localhost:${PORT}`);
    console.log(`Access the login page at: http://localhost:${PORT}/login`);
});