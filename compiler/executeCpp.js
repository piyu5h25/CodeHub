import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { exec } from "child_process";  // childprocess terminal ka instance use krta h // exec is a function that executes a command in the terminal

const __dirname = dirname(fileURLToPath(import.meta.url));

const outputPath = path.join(__dirname, "outputs"); // C:\Users\trive\Desktop\Online Judge\compiler/outputs

if(!fs.existsSync(outputPath)){
    fs.mkdirSync(outputPath, {recursive: true}); 
}
const executeCpp = async (filePath)=>{ // filePath: C:\Users\trive\Desktop\Online Judge\compiler/codes/a96cf189-a776-4002-8c54-6ad70b5cb4c4.cpp
    const jobId = path.basename(filePath).split(".")[0]; // jobId: ['a96cf189-a776-4002-8c54-6ad70b5cb4c4', "cpp"]
    const outputFile = `${jobId}.exe`;
    const outPath = path.join(outputPath, `${outputFile}`); // outPath: C:\Users\trive\Desktop\Online Judge\compiler/outputs/a96cf189-a776-4002-8c54-6ad70b5cb4c4.exe

    return new Promise((resolve, reject)=>{
        // g++ is a compiler for c++ language
        // ${filePath} is the path of the file to be compiled
        // -o ${outPath} is the path of the output file. output ko outpath me store karna hai a.out ki jagah outpath me store hoga
        // && ${outPath} is the command to run the output file
        exec(`g++ "${filePath}" -o "${outPath}" && "${outPath}"`,(error,stdout, stderr)=>{  // cd is used to change the directory
            if(error){
                reject({error, stderr});
            }
            if(stderr){
                reject(stderr);
            }
            resolve(stdout);
        })
    })

}
export default executeCpp;