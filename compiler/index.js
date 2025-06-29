import express from "express";
import generateFile from "./generateFile.js";
import executeCpp from "./executeCpp.js";
import executePython from "./executePython.js";
import executeC from "./executeC.js";
import executeJava from "./executeJava.js";
import dotenv from "dotenv";
import generateAiResponse from "./generateAiResponse.js";
dotenv.config();
const app = express();  
app.use(express.json());
app.use(express.urlencoded({extended: true}));
import cors from "cors";
app.use(cors());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("Hello World");
});
app.post("/run",async (req, res)=>{
    // const code = req.body.code;
    // const language = req.body.language;
    // give default lang as c++
    const {code,
         language = 'cpp',
         input = ''
        } = req.body;
    if(code === undefined){
        return res.status(400).json({success: false, error: "Code is required"});
    }
    

     try {
        const filePath = generateFile(language, code);
        let output;
        if(language === "cpp"){
            output = await executeCpp(filePath, input);
        }
        else if(language === "python"){
            output = await executePython(filePath, input);
        }
        else if(language === "java"){
            output = await executeJava(filePath, input);
        }
        else if(language === "c"){
            output = await executeC(filePath, input);
        }

        res.json({success: true, output, filePath});

     } catch (error) {
        console.log(error); 
        res.status(500).json({success: false,
            error: error.message || error.stderr || "Sorry, Something went wrong"
        });
        
     }

})
app.post("/ai-review", async (req, res)=>{
    const {code, language} = req.body;
    if(code === undefined || code.trim() === "" || language === undefined || language.trim() === ""){
        return res.status(400).json({success: false, error: `{"code": "Code is required", "language": "Language is required"}`});
    }
    try{
        const aiResponse = await(generateAiResponse(code, language));
        res.json({success: true,
             aiResponse
        });
    }catch(error){
        console.log(error);
        res.status(500).json({success: false, error: error.message || error.stderr || "Sorry, Something went wrong"});
    }
})

app.listen(PORT, () => {    
    console.log(`Server is running on port ${PORT}`);
});