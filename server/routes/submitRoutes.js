import express from 'express';
import { handleSubmission } from '../controllers/submitController.js';

const router = express.Router();

router.post('/', handleSubmission);

export default router;
