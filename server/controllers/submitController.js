import Problem from "../models/problemModel.js";
import { runCode } from "../utils/runCode.js"; // you’ll create this too

export const handleSubmission = async (req, res) => {
  const { problemId, code, language } = req.body;

  try {
    const problem = await Problem.findById(problemId);
    if (!problem) return res.status(404).json({ error: "Problem not found" });

    const testCases = problem.testCases;
    const results = [];

    for (let test of testCases) {
    //   const result = await ru
      const result = await runCode(code, language, test.input);
            results.push({
              input: test.input,
              expected: test.output,
              output: result.output,
              passed: result.output.trim() === test.output.trim(),
            });
          }
      
          res.json({ success: true, results });
        } catch (err) {
          console.error(err);
          res.status(500).json({ error: "Error while evaluating code." });
        }
}
      
     