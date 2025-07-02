import Problem from '../models/Problem.js';
import User from '../models/User.js';
import { updateScore } from '../utils/updateScore.js';
import axios from 'axios';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

export const handleSubmission = async (req, res) => {
    try {
        const { code, language, problemId } = req.body;

        if (!code || !language || !problemId) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        if (!mongoose.Types.ObjectId.isValid(problemId)) {
            return res.status(400).json({ message: "Invalid problem ID" });
        }

        const problem = await Problem.findById(problemId);

        if (!problem) {
            return res.status(404).json({ message: "Problem not found" });
        }

        const testCases = problem.testCases;

        if (!testCases || testCases.length === 0) {
            return res.status(400).json({ message: "No test cases found" });
        }

        const normalize = (str) => {
            return str?.toString().trim().replace(/\s+/g, ' ');
        };

        let passedTests = 0;
        const totalTests = testCases.length;

        for (let i = 0; i < totalTests; i++) {
            const testCase = testCases[i];

            const input = testCase.input || '';
            const expectedOutput = testCase.output || '';

            const response = await axios.post(`${process.env.COMPILER_URL}/run`, {
                code,
                language,
                input
            });

            const { output, error, success } = response.data;

            if (success === false) {
                return res.json({ verdict: "Compilation Error", error });
            }

            if (error && error.trim() !== '') {
                return res.json({ verdict: "Runtime Error", error });
            }

            const cleanOutput = normalize(output);
            const cleanExpected = normalize(expectedOutput);

            if (cleanOutput !== cleanExpected) {
                return res.json({
                    verdict: "Wrong Answer",
                    testCase: i + 1,
                    input,
                    expectedOutput: cleanExpected,
                    receivedOutput: cleanOutput,
                    passedTests,
                    totalTests
                });
            }

            passedTests++;
        }

        const userId = req.user._id;
        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        console.log('User Info:', req.user);

        const alreadySolved = await User.findOne({
            _id: userId,
            'solvedProblems.problemId': problemId,
        });

        if (!alreadySolved) {
            await User.findByIdAndUpdate(userId, {
                $push: {
                    solvedProblems: {
                        problemId: problemId,
                        difficulty: problem.difficulty,
                    },
                },
            });

            await updateScore(userId, problemId, problem.difficulty);
        }

        // ✅ Fetch latest user data to send updated totalScore
        const currentUser = await User.findById(userId);

        return res.json({
            verdict: "Accepted",
            passedTests,
            totalTests,
            message: `All ${totalTests} test cases passed!`,
            totalScore: currentUser.totalScore,
        });

    } catch (err) {
        console.error('Error in handleSubmission:', err);
        return res.status(500).json({ message: "Server Error", error: err.message });
    }
};
