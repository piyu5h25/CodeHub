import User from "../models/User.js";

export const getLeaderboard = async (req, res) => {
    try {
        const leaderboard = await User.find({
            totalScore: { $exists: true, $ne: null }  // Only users with scores
        })
        .select("firstName lastName totalScore")
        .sort({ totalScore: -1 })
        .limit(10);

        res.status(200).json({
            success: true,
            leaderboard
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message 
        });
    }
};