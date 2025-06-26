import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { exec } from "child_process";
const __dirname = dirname(fileURLToPath(import.meta.url));

const outputPath = path.join(__dirname, "outputs");//C:\Users\trive\Desktop\Online Judge\compiler/outputs

if(!fs.existsSync(outputPath)){
    fs.mkdirSync(outputPath, {recursive: true});
}

const executePython = async (filePath)=>{ // filePath: C:\Users\trive\Desktop\Online Judge\compiler/codes/a96cf189-a776-4002-8c54-6ad70b5cb4c4.py
    const jobId = path.basename(filePath).split(".")[0]; // jobId: ['a96cf189-a776-4002-8c54-6ad70b5cb4c4', "py"]
    const outPath = path.join(outputPath, `${jobId}.exe`); // outPath: C:\Users\trive\Desktop\Online Judge\compiler/outputs/a96cf189-a776-4002-8c54-6ad70b5cb4c4.exe

    return new Promise((resolve, reject)=>{
        exec(`python "${filePath}"`,(error,stdout, stderr)=>{
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

export default executePython;
