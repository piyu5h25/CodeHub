import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { exec } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));

const outputPath = path.join(__dirname, "outputs");
if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

const executePython = async (filePath, input = '') => {
    return new Promise((resolve, reject) => {
        const child = exec(`python "${filePath}"`, (error, stdout, stderr) => {
            if (error) {
                reject({
                    error: "Runtime Error",
                    stderr: stderr || error.message,
                });
                return;
            }
            resolve(stdout);
        });

        if (input && input.trim() !== '') {
            child.stdin.write(input);
        }
        child.stdin.end();
    });
};

export default executePython;
