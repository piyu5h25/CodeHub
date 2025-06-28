import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from 'uuid'; // uuidv4 is a function that generates a random uuid which is unique for each file

const __dirname = dirname(fileURLToPath(import.meta.url));

const dirCodes = path.join(__dirname, "codes");

if(!fs.existsSync(dirCodes)){
    fs.mkdirSync(dirCodes, {recursive: true}); 
}






const generateFile = (language, code) => {
    const jobId = uuidv4();
    
 
    const safeClassName = `Class_${jobId.replace(/-/g, "_")}`;
    
    const fileName = `${safeClassName}.${language}`;
    const filePath = path.join(dirCodes, fileName);

    if (language === "java") {
        code = code.replace(/public\s+class\s+\w+/, `public class ${safeClassName}`);
    }

    fs.writeFileSync(filePath, code);
    return filePath;
};
export default generateFile;