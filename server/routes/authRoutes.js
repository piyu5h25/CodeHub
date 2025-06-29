import express from "express";
import { register, login, getUserCount } from "../controllers/authController.js";

const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.get("/users/count", getUserCount);
export default router;