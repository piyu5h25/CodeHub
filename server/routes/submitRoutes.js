import express from "express";
const router = express.Router();
const { handleSubmission } = require("../controllers/submitController.js");

router.post('/api/submit', handleSubmission);
module.exports = router;