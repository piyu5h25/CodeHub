import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { exec } from "child_process";  // childprocess terminal ka instance use krta h // exec is a function that executes a command in the terminal

const __dirname = dirname(fileURLToPath(import.meta.url));

const outputPath = path.join(__dirname, "outputs"); // C:\Users\trive\Desktop\Online Judge\compiler/outputs

if(!fs.existsSync(outputPath)){
    fs.mkdirSync(outputPath, {recursive: true}); 
}
const executeCpp = async (filePath, input='')=>{ // filePath: C:\Users\trive\Desktop\Online Judge\compiler/codes/a96cf189-a776-4002-8c54-6ad70b5cb4c4.cpp
    const jobId = path.basename(filePath).split(".")[0]; // jobId: ['a96cf189-a776-4002-8c54-6ad70b5cb4c4', "cpp"]
    const outputFile = `${jobId}.out`;
    const outPath = path.join(outputPath, `${outputFile}`); // outPath: C:\Users\trive\Desktop\Online Judge\compiler/outputs/a96cf189-a776-4002-8c54-6ad70b5cb4c4.exe

    return new Promise((resolve, reject)=>{
        // g++ is a compiler for c++ language
        // ${filePath} is the path of the file to be compiled
        // -o ${outPath} is the path of the output file. output ko outpath me store karna hai a.out ki jagah outpath me store hoga
        // && ${outPath} is the command to run the output file
        exec(`g++ "${filePath}" -o "${outPath}"`,(compileError, compileStdout, compileStderr)=>{  // cd is used to change the directory
            if(compileError){
                reject({
                    error : "Compilation Error",
                    stderr : compileStderr || compileError.message
                });
                return;
            }
            if(compileStderr){
                reject({
                    error : "Compilation Error",
                    stderr: compileStderr
                });
                return;
            }
            const child = exec(`"${outPath}"`, (runError, runStdout, runStderr)=>{
                if(fs.existsSync(outPath)){
                    try {
                        fs.unlinkSync(outPath);
                    } catch (cleanupError) {
                        console.log("Cleanup Error: ", cleanupError);
                    }
                }
                if(runError){
                    reject({
                        error : "Execution Error",
                        stderr : runStderr || runError.message
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

            if(input && input.trim() !== ''){
                child.stdin.write(input);
            }
            child.stdin.end();
        })
    })

}
export default executeCpp;