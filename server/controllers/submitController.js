import Problem from '../models/Problem.js';
import axios from 'axios';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

export const handleSubmission = async (req, res) => {
    try {
        console.log('\n🔍 ========== SUBMISSION FULL DEBUG ==========');
        
        const { code, language, problemId } = req.body;

        console.log('📥 REQUEST DATA:');
        console.log('  - Problem ID:', problemId);
        console.log('  - Language:', language);
        console.log('  - Code length:', code?.length);
        console.log('  - Code preview:', code?.substring(0, 100) + '...');

        // Validation
        if (!code || !language || !problemId) {
            console.log('❌ Missing required fields');
            return res.status(400).json({ message: "Missing required fields" });
        }

        if (!mongoose.Types.ObjectId.isValid(problemId)) {
            console.log('❌ Invalid problem ID format');
            return res.status(400).json({ message: "Invalid problem ID" });
        }

        // Database query
        console.log('\n📊 DATABASE QUERY:');
        console.log('  - Querying problem with ID:', problemId);
        
        const problem = await Problem.findById(problemId);
        
        if (!problem) {
            console.log('❌ Problem not found in database');
            return res.status(404).json({ message: "Problem not found" });
        }

        console.log('✅ Problem found:');
        console.log('  - Problem title:', problem.title || 'No title');
        console.log('  - Problem ID from DB:', problem._id.toString());
        console.log('  - Test cases count:', problem.testCases?.length || 0);

        const testCases = problem.testCases;
        
        if (!testCases || testCases.length === 0) {
            console.log('❌ No test cases found');
            return res.status(400).json({ message: "No test cases found" });
        }

        console.log('\n🧪 TEST CASES ANALYSIS:');
        console.log('  - Total test cases:', testCases.length);
        
        // Analyze each test case and validate data integrity
        for (let i = 0; i < testCases.length; i++) {
            const tc = testCases[i];
            console.log(`  - Test Case ${i + 1}:`);
            console.log(`    Input: "${tc.input}" (length: ${tc.input?.length || 0})`);
            console.log(`    Output: "${tc.output}" (length: ${tc.output?.length || 0})`);
            console.log(`    Input type: ${typeof tc.input}`);
            console.log(`    Output type: ${typeof tc.output}`);

            // FIXED: Better validation for corrupted data
            if (tc.input === undefined || tc.input === null || tc.input === 'undefined') {
                console.log(`❌ Test case ${i + 1} has corrupted input data:`, tc.input);
                return res.status(400).json({ 
                    message: `Test case ${i + 1} has corrupted input data. Please contact administrator.`,
                    testCase: i + 1
                });
            }

            if (tc.output === undefined || tc.output === null || tc.output === 'undefined') {
                console.log(`❌ Test case ${i + 1} has corrupted output data:`, tc.output);
                return res.status(400).json({ 
                    message: `Test case ${i + 1} has corrupted output data. Please contact administrator.`,
                    testCase: i + 1
                });
            }
        }

        // Check for problematic test cases (for logging only)
        const emptyInputCases = testCases.filter(tc => tc.input === '');
        const emptyOutputCases = testCases.filter(tc => tc.output === '');
        
        if (emptyInputCases.length > 0) {
            console.log(`⚠️  INFO: ${emptyInputCases.length} test cases with empty input (this may be valid)`);
        }
        if (emptyOutputCases.length > 0) {
            console.log(`⚠️  INFO: ${emptyOutputCases.length} test cases with empty output (this may be valid)`);
        }

        const normalize = (str) => {
            const original = str;
            const normalized = str.toString().trim().replace(/\s+/g, ' ');
            if (original !== normalized) {
                console.log(`🔧 Normalized: "${original}" → "${normalized}"`);
            }
            return normalized;
        };

        let passedTests = 0;
        const totalTests = testCases.length;

        console.log('\n🚀 STARTING TEST EXECUTION:');

        for (let i = 0; i < testCases.length; i++) {
            const testCase = testCases[i];
            console.log(`\n--- 🧪 TEST CASE ${i + 1}/${totalTests} ---`);
            
            const input = testCase.input;
            const expectedOutput = testCase.output;
            
            console.log('📋 Test Case Details:');
            console.log('  Input (raw):', JSON.stringify(input));
            console.log('  Expected (raw):', JSON.stringify(expectedOutput));
            console.log('  Input isEmpty:', input === '');
            console.log('  Expected isEmpty:', expectedOutput === '');

            // FIXED: Removed problematic skip logic
            // Now all test cases will be executed, including empty ones
            // Empty input/output can be valid test cases

            // Compiler call
            console.log('\n📞 CALLING COMPILER:');
            const compilerPayload = { code, language, input: input || '' };
            console.log('  Payload:', {
                language,
                input: JSON.stringify(input || ''),
                codePreview: code.substring(0, 50) + '...'
            });

            let response;
            try {
                const startTime = Date.now();
                response = await axios.post(`${process.env.COMPILER_URL}/run`, compilerPayload, {
                    timeout: 10000
                });
                const endTime = Date.now();
                console.log(`  ⏱️  Compiler response time: ${endTime - startTime}ms`);
            } catch (err) {
                console.error('❌ COMPILER ERROR:', err.message);
                if (err.code === 'ECONNREFUSED') {
                    console.error('  → Compiler server not running on port 3000');
                } else if (err.code === 'ECONNABORTED') {
                    console.error('  → Compiler request timed out');
                }
                return res.status(500).json({ 
                    verdict: "Compilation Server Error", 
                    error: err.message 
                });
            }

            console.log('\n📤 COMPILER RESPONSE:');
            console.log('  Full response:', JSON.stringify(response.data, null, 2));

            const { output, error, success } = response.data || {};

            // Analyze compiler response
            console.log('📊 Response Analysis:');
            console.log('  - Success:', success);
            console.log('  - Has Error:', !!error);
            console.log('  - Output length:', output?.length || 0);
            console.log('  - Output (raw):', JSON.stringify(output));

            // Check compilation/execution status
            if (success === false) {
                console.log('❌ COMPILATION FAILED');
                return res.json({ 
                    verdict: "Compilation Error", 
                    error: error || 'Unknown compilation error',
                    testCase: i + 1,
                    passedTests,
                    totalTests
                });
            }

            if (error && error.trim() !== '') {
                console.log('❌ RUNTIME ERROR');
                return res.json({ 
                    verdict: "Runtime Error", 
                    error: error.trim(),
                    testCase: i + 1,
                    passedTests,
                    totalTests
                });
            }

            // Output comparison
            console.log('\n🔍 OUTPUT COMPARISON:');
            const rawOutput = output || '';
            const cleanOutput = normalize(rawOutput);
            const cleanExpected = normalize(expectedOutput);

            console.log('  Raw output:', JSON.stringify(rawOutput));
            console.log('  Clean output:', JSON.stringify(cleanOutput));
            console.log('  Clean expected:', JSON.stringify(cleanExpected));
            console.log('  Outputs match:', cleanOutput === cleanExpected);
            console.log('  Length comparison:', cleanOutput.length, 'vs', cleanExpected.length);

            if (cleanOutput !== cleanExpected) {
                console.log(`❌ TEST CASE ${i + 1} FAILED - WRONG ANSWER`);
                console.log('📊 Failure Details:');
                console.log('  - Expected vs Actual character comparison:');
                const maxLen = Math.max(cleanExpected.length, cleanOutput.length);
                for (let j = 0; j < maxLen; j++) {
                    const expChar = cleanExpected[j] || '(end)';
                    const actChar = cleanOutput[j] || '(end)';
                    if (expChar !== actChar) {
                        console.log(`    Position ${j}: expected '${expChar}' (${expChar.charCodeAt(0)}) got '${actChar}' (${actChar.charCodeAt ? actChar.charCodeAt(0) : 'N/A'})`);
                        break;
                    }
                }

                return res.json({
                    verdict: "Wrong Answer",
                    testCase: i + 1,
                    input: input,
                    expectedOutput: cleanExpected,
                    receivedOutput: cleanOutput,
                    passedTests,
                    totalTests,
                    debug: {
                        rawOutput,
                        rawExpected: expectedOutput,
                        cleanOutput,
                        cleanExpected,
                        compilerResponse: response.data
                    }
                });
            }

            passedTests++;
            console.log(`✅ TEST CASE ${i + 1} PASSED`);
        }

        console.log('\n🎉 ALL TEST CASES PASSED!');
        console.log(`✅ Final Result: ${passedTests}/${totalTests} test cases passed`);

        return res.json({ 
            verdict: "Accepted",
            passedTests,
            totalTests,
            message: `All ${totalTests} test cases passed!`
        });

    } catch (err) {
        console.error('\n💥 CRITICAL ERROR:', err);
        console.error('Stack trace:', err.stack);
        return res.status(500).json({ 
            message: "Internal Server Error", 
            error: err.message
        });
    }
}; 