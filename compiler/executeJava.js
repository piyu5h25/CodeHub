import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { exec } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

const executeJava = async (filePath, input = '') => {
    const jobId = path.basename(filePath).split(".")[0];
    const className = jobId;

    const compileCommand = `javac "${filePath}" -d "${outputPath}"`;
    const runCommand = `java -cp "${outputPath}" ${className}`;

    return new Promise((resolve, reject) => {
        // Compile first
        exec(compileCommand, (compileError, compileStdout, compileStderr) => {
            if (compileError) {
                reject({
                    error: "Compilation Error",
                    stderr: compileStderr || compileError.message,
                });
                return;
            }

            // Run compiled Java class
            const child = exec(runCommand, (runError, runStdout, runStderr) => {
                if (runError) {
                    reject({
                        error: "Runtime Error",
                        stderr: runStderr || runError.message,
                    });
                    return;
                }
                resolve(runStdout);
            });

            // Pass input (stdin)
            if (input && input.trim() !== '') {
                child.stdin.write(input);
            }
            child.stdin.end();
        });
    });
};

export default executeJava;
