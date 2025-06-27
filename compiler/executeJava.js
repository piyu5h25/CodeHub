import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { exec } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

const executeJava = async (filePath) => {
    const jobId = path.basename(filePath).split(".")[0];
    const className = jobId;  

    return new Promise((resolve, reject) => {
        const compileCommand = `javac "${filePath}" -d "${outputPath}"`;
        const runCommand = `cd "${outputPath}" && java ${className}`;

        exec(`${compileCommand} && ${runCommand}`, (error, stdout, stderr) => {
            if (error) {
                reject({ error, stderr });
            } else if (stderr) {
                reject(stderr);
            } else {
                resolve(stdout);
            }
        });
    });
};

export default executeJava;