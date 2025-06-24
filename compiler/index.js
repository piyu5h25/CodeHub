import express from "express";
import generateFile from "./generateFile.js";
import executeCpp from "./executeCpp.js";
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.send("Hello World");
});
app.post("/run",async (req, res)=>{
    // const code = req.body.code;
    // const language = req.body.language;
    // give default lang as c++
    const {code, language = 'cpp'} = req.body;
    if(code === undefined){
        return res.status(400).json({success: false, error: "Code is required"});
    }
    

     try {
        const filePath = generateFile(language, code);
        const output = await executeCpp(filePath);

        res.json({success: true, output, filePath});

     } catch (error) {
        res.status(500).json({success: false, error: error.message});
        
     }

})
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});