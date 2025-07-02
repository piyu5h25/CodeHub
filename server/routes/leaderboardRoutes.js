import express from 'express';
import { getLeaderboard } from '../controllers/leaderboardController.js'; 
import { authenticateToken } from '../middleware/auth.js';  

const router = express.Router();

router.get('/', authenticateToken, getLeaderboard);

export default router;
