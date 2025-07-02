import express from 'express';
import { handleSubmission } from '../controllers/submitController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticateToken, handleSubmission);

export default router;
