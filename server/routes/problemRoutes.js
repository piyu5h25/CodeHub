import express from "express";
import { createProblem, getProblems, getProblemByTitle, updateProblem, deleteProblem, getProblemsByTopic, getProblemsByDifficulty, getProblemsByCompany } from "../controllers/problemController.js";

const router = express.Router();

router.post("/create", createProblem);
router.get("/", getProblems);
router.get("/:title", getProblemByTitle);
router.put("/:title", updateProblem);
router.delete("/:title", deleteProblem);
router.get("/topic/:topic", getProblemsByTopic);
router.get("/difficulty/:difficulty", getProblemsByDifficulty);
router.get("/company/:company", getProblemsByCompany);

export default router;