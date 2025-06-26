import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { exec } from "child_process";  // childprocess terminal ka instance use krta h // exec is a function that executes a command in the terminal

const __dirname = dirname(fileURLToPath(import.meta.url));

const outputPath = path.join(__dirname, "outputs"); // C:\Users\trive\Desktop\Online Judge\compiler/outputs

if(!fs.existsSync(outputPath)){
    fs.mkdirSync(outputPath, {recursive: true}); 
}

const executeC = async (filePath)=>{
    const jobId = path.basename(filePath).split(".")[0];
    const outPath = path.join(outputPath, `${jobId}.exe`);
    return new Promise((resolve, reject)=>{
        exec(`gcc "${filePath}" -o "${outPath}" && "${outPath}"`,(error,stdout, stderr)=>{
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

export default executeC;
