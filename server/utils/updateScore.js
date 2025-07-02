import User from "../models/User.js";
import Problem from "../models/Problem.js";

export const updateScore = async (userId, problemId, difficulty) => {
    const user = await User.findById(userId);
    if (!user) return;

    const problem = await Problem.findById(problemId);
    if (!problem) return;

    const difficultyScore = {
        "Beginner": 10,
        "Easy": 13,
        "Medium": 16,
        "Hard": 20,
    };

    const score = difficultyScore[difficulty] || 0;

    user.totalScore = (user.totalScore || 0) + score;
    console.log(`Adding ${score} to ${user.firstName}'s totalScore`);
    console.log(`New totalScore: ${user.totalScore}`);

    await user.save();

    return user.totalScore;  
};
