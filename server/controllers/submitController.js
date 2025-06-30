import Problem from '../models/Problem.js';
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

        const normalize = (str) => str.toString().trim().replace(/\s+/g, ' ');

        for (let i = 0; i < testCases.length; i++) {
            const { input, output: expectedOutput } = testCases[i];

            try {
                const response = await axios.post(`${process.env.COMPILER_URL}/run`, {
                    code,
                    language,
                    input: input || ''
                });

                const { output, error, success } = response.data || {};

                if (success === false) {
                    return res.json({
                        testCase: i + 1,
                        verdict: "Compilation Error",
                        message: "Compilation failed.",
                        input,
                        error: error || 'Unknown error'
                    });
                }

                if (error && error.trim() !== '') {
                    return res.json({
                        testCase: i + 1,
                        verdict: "Runtime Error",
                        message: "Runtime error occurred.",
                        input,
                        error: error.trim()
                    });
                }

                const cleanOutput = normalize(output || '');
                const cleanExpected = normalize(expectedOutput);

                if (cleanOutput !== cleanExpected) {
                    return res.json({
                        testCase: i + 1,
                        verdict: "Wrong Answer",
                        message: `Test case failed for input "${input}". Expected "${cleanExpected}" but got "${cleanOutput}".`,
                        input,
                        expectedOutput: cleanExpected,
                        receivedOutput: cleanOutput
                    });
                }

                // ✅ If test case passed, send message for it
                res.write(JSON.stringify({
                    testCase: i + 1,
                    verdict: "Passed",
                    message: `Test case ${i + 1} passed successfully.`
                }) + '\n');

            } catch (err) {
                return res.json({
                    testCase: i + 1,
                    verdict: "Server Error",
                    message: "Compiler server error.",
                    input,
                    error: err.message
                });
            }
        }

        // ✅ If all test cases passed
        res.end(JSON.stringify({
            verdict: "Accepted",
            message: `All ${testCases.length} test cases passed successfully.`
        }));

    } catch (err) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });
    }
};
