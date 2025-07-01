import mongoose from "mongoose";

// user schema
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "First name is required"],
        trim: true,
        minlength: [2, "First name must be at least 2 characters long"],
        maxlength: [50, "First name must be less than 50 characters long"],
    },
    lastName: {
        type: String,
        required: [true, "Last name is required"],
        trim: true,
        minlength: [2, "Last name must be at least 2 characters long"],
        maxlength: [50, "Last name must be less than 50 characters long"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please enter a valid email address"
        ],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [5, "Password must be at least 5 characters long"],
    },

    // ⭐️ For leaderboard:
    totalScore: {
        type: Number,
        default: 0,
    },

    
    solvedProblems: [
        {
            problemId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Problem",
                required: true,
            },
            difficulty: {
                type: String,
                enum: ["Beginner", "Easy", "Medium", "Hard"],
                required: true,
            },
        }
    ],

    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },

}, { timestamps: true });

export default mongoose.model("User", userSchema);
