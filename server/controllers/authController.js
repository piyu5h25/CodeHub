import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// REGISTER CONTROLLER
export const register = async (req, res) => {
    try {
        // get all data from frontend
        const { firstName, lastName, email, password } = req.body;
        
        // Check if all fields are filled
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            email: email.toLowerCase()
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists with same email",
            });
        }

        // Hash the password
        const saltRound = 12;
        const hashedPassword = await bcrypt.hash(password, saltRound);

        // Create user if not exists and save to database
        const user = await User.create({
            firstName: firstName,
            lastName: lastName,
            email: email.toLowerCase(),
            password: hashedPassword,
        });

        // Generate token to secure the transfer of data
        const token = jwt.sign({
            id: user._id,
            email: user.email,
        }, 
        process.env.JWT_SECRET, {
            expiresIn: "24h",
        });

        const userResponse = {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            createdAt: user.createdAt,
        };

        res.status(201).json({
            success: true,
            message: "You have successfully registered",
            user: userResponse,
            token,
        });
    } catch (error) {
        console.error("Registration failed", error);
        
        if (error.name === "ValidationError") {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validationErrors,
            });
        }
        
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "User already exists with same email",
            });
        }
        
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false,
                message: "Invalid token",
            });
        }
        
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Token expired",
            });
        }
        
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Enter both email and password",
            });
        }
        
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }
        
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Invalid password for this email",
            });
        }
        
        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "24h",
            }
        );

        const cookieOptions = {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        };

        const userResponse = {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            totalScore: user.totalScore,
            solvedProblems: user.solvedProblems,
            createdAt: user.createdAt,
        };

        res.status(200)
            .cookie("token", token, cookieOptions)
            .json({
                success: true,
                message: "User logged in successfully",
                user: userResponse,
                token: token,
            });

    } catch (error) {
        console.error("Login failed", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

// GET USER COUNT CONTROLLER
export const getUserCount = async (req, res) => {
    try {
        const count = await User.countDocuments();
        res.status(200).json({
            success: true,
            count: count
        });
    } catch (error) {
        console.error("Error getting user count:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};