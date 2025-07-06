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
        let failedTestCase = null;
        let executionTime = 0;
        let memoryUsed = 0;

        for (let i = 0; i < totalTests; i++) {
            const testCase = testCases[i];
            const input = testCase.input || '';
            const expectedOutput = testCase.output || '';

            try {
                const response = await axios.post(`${process.env.COMPILER_URL}/run`, {
                    code,
                    language,
                    input
                });

                const { output, error, success, time, memory } = response.data;

                // Track execution metrics
                if (time) executionTime = Math.max(executionTime, parseInt(time) || 0);
                if (memory) memoryUsed = Math.max(memoryUsed, parseInt(memory) || 0);

                // Handle compilation errors
                if (success === false) {
                    return res.json({ 
                        verdict: "Compilation Error", 
                        error: error || "Code compilation failed",
                        totalTestcases: totalTests,
                        passedTestcases: 0,
                        executionTime: `${executionTime}ms`,
                        memoryUsed: `${memoryUsed}MB`
                    });
                }

                // Handle runtime errors
                if (error && error.trim() !== '') {
                    return res.json({ 
                        verdict: "Runtime Error", 
                        error: "Program crashed during execution",
                        failedTestcase: i + 1,
                        totalTestcases: totalTests,
                        passedTestcases: passedTests,
                        executionTime: `${executionTime}ms`,
                        memoryUsed: `${memoryUsed}MB`
                    });
                }

                
                const cleanOutput = normalize(output);
                const cleanExpected = normalize(expectedOutput);

                if (cleanOutput !== cleanExpected) {
                    failedTestCase = i + 1;
                    break;
                }

                passedTests++;

            } catch (axiosError) {
                console.error(`Error running test case ${i + 1}:`, axiosError.message);
                return res.json({
                    verdict: "Runtime Error",
                    error: "Code execution failed",
                    failedTestcase: i + 1,
                    totalTestcases: totalTests,
                    passedTestcases: passedTests,
                    executionTime: `${executionTime}ms`,
                    memoryUsed: `${memoryUsed}MB`
                });
            }
        }

        
        if (failedTestCase) {
            return res.json({
                verdict: "Wrong Answer",
                failedTestcase: failedTestCase,
                totalTestcases: totalTests,
                passedTestcases: passedTests,
                executionTime: `${executionTime}ms`,
                memoryUsed: `${memoryUsed}MB`,
                details: `Failed at test case ${failedTestCase}. Check your logic and edge cases.`
                
            });
        }

        // All test cases passed - handle user scoring
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

        
        const currentUser = await User.findById(userId);

        return res.json({
            verdict: "Accepted",
            totalTestcases: totalTests,
            passedTestcases: passedTests,
            executionTime: `${executionTime}ms`,
            memoryUsed: `${memoryUsed}MB`,
            details: `All ${totalTests} test cases passed! Great job!`,
            totalScore: currentUser.totalScore,
            
        });

    } catch (err) {
        console.error('Error in handleSubmission:', err);
        return res.status(500).json({ 
            message: "Server Error", 
            error: "Something went wrong while processing your submission",
            verdict: "Submission Error"
        });
    }
};