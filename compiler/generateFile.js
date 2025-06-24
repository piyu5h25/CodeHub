import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from 'uuid'; // uuidv4 is a function that generates a random uuid which is unique for each file

const __dirname = dirname(fileURLToPath(import.meta.url));

const dirCodes = path.join(__dirname, "codes");

if(!fs.existsSync(dirCodes)){
    fs.mkdirSync(dirCodes, {recursive: true}); 
}



const generateFile = (language, code)=>{
    const jobId = uuidv4(); // jobId: unique id for each file: a96cf189-a776-4002-8c54-6ad70b5cb4c4
    const fileName = `${jobId}.${language}`; // fileName: a96cf189-a776-4002-8c54-6ad70b5cb4c4.cpp

    const filePath = path.join(dirCodes, fileName); // filePath: C:\Users\trive\Desktop\Online Judge\compiler/codes/a96cf189-a776-4002-8c54-6ad70b5cb4c4.cpp

    fs.writeFileSync(filePath, code); 

    return filePath;

}
export default generateFile;