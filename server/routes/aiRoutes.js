import express from 'express';
import axios from 'axios';

const router = express.Router();

router.post('/', async (req, res) => {
    const { code, language } = req.body;

    if (!code || !language) {
        return res.status(400).json({ error: 'Code and language are required' });
    }

    try {
        console.log("ai response");
        const response = await axios.post(`${process.env.COMPILER_URL}/ai-review`, { code, language });
        res.json(response.data);
    } catch (error) {
        console.error('AI Review Error:', error.message);
        res.status(500).json({ error: 'Failed to generate AI response' });
    }
});

export default router;
