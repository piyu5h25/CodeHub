import Problem from "../models/Problem.js";

export const createProblem = async(req,res)=>{
    try {
        const problem= await Problem.create(req.body);
        console.log("Problem created:", problem.toObject());
        res.status(201).json({
            success: true,
            message: "Problem created successfully",
            problem,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Problem creation failed",
            error: error.message,
        });
    }
}

export const getProblems = async(req,res)=>{
    try {
        const problems= await Problem.find();
        res.status(200).json({
            success: true,
            message: "Problems fetched successfully",
            problems,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Problem fetching failed",
            error: error.message,
        });
    }
}

export const getProblemByTitle = async(req,res)=>{
    try {
        const problem= await Problem.findOne({ title: req.params.title });
        if(!problem){
            return res.status(404).json({
                success: false,
                message: "Problem not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Problem fetched successfully",
            problem,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Problem fetching failed",
            error: error.message,
        });
    }
}

export const updateProblem = async(req,res)=>{
    try {
        const problem= await Problem.findOneAndUpdate({ title: req.params.title }, req.body, {new: true});
        if(!problem){
            return res.status(404).json({
                success: false,
                message: "Problem not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Problem updated successfully",
            problem,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Problem updating failed",
            error: error.message,
        });
    }
}

export const deleteProblem = async(req,res)=>{
    try {
        const problem= await Problem.findOneAndDelete({ title: req.params.title });
        if(!problem){
            return res.status(404).json({
                success: false,
                message: "Problem not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Problem deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Problem deletion failed",
            error: error.message,
        });
    }
}

export const getProblemsByTopic = async(req,res)=>{
    try {
        const problems= await Problem.find({topic: req.params.topic});
        res.status(200).json({
            success: true,
            message: "Problems fetched successfully",
            problems,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Problem fetching failed",
            error: error.message,
        });
    }
}

export const getProblemsByDifficulty = async(req,res)=>{
    try {
        const problems= await Problem.find({difficulty: req.params.difficulty});
        res.status(200).json({
            success: true,
            message: "Problems fetched successfully",
            problems,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Problem fetching failed",
            error: error.message,
        });
    }
}

export const getProblemsByCompany = async(req,res)=>{
    try {
        const problems= await Problem.find({companiesAskedIn: req.params.company});
        res.status(200).json({
            success: true,
            message: "Problems fetched successfully",
            problems,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Problem fetching failed",
            error: error.message,
        });
    }
}


