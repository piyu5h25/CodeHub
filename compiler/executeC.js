import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { exec } from "child_process";  // childprocess terminal ka instance use krta h // exec is a function that executes a command in the terminal
import { stderr } from "process";
import { error, log } from "console";

const __dirname = dirname(fileURLToPath(import.meta.url));

const outputPath = path.join(__dirname, "outputs"); // C:\Users\trive\Desktop\Online Judge\compiler/outputs

if(!fs.existsSync(outputPath)){
    fs.mkdirSync(outputPath, {recursive: true}); 
}

const executeC = async (filePath, input='')=>{
    const jobId = path.basename(filePath).split(".")[0];
    const outputFile = `${jobId}.out`;
    const outPath = path.join(outputPath, `${outputFile}`);
    return new Promise((resolve, reject)=>{
        exec(`gcc "${filePath}" -o "${outPath}"`,(compileError,compileStdout, compileStderr)=>{
            if(compileError){
                reject({
                    error: "Compilation Error",
                    stderr: compileStderr || compileError.message
                });
                return;
            }
            if(compileStderr){
                reject({
                    error: "Compilation Error",
                    stderr: compileStderr
                });
                return;
            }
            const child = exec(`"${outPath}"`, (runError, runStdout, runStderr)=>{
                if(fs.existsSync(outPath)){
                    try{
                        fs.unlinkSync(outPath);
                    }
                    catch(cleanupError){
                        console.log("Cleanup Error: ", cleanupError);
                    }
                }
                if(runError){
                    reject({
                        error: "Execution Error",
                        stderr: runStderr || runError.message
                    });
                    return;
                }
                if(runStderr){
                    reject({
                        error : "Runtime Error",
                        stderr : runStderr
                    });
                    return;
                }
                resolve(runStdout);
            })
            if(input && input.trim()!==''){
                child.stdin.write(input);
            }
            child.stdin.end();
        })
    })
}      

export default executeC;
