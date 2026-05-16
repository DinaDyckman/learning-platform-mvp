import express from 'express';
import { generatePrompt, getHistory } from '../controllers/promptController';

const router = express.Router();

router.post('/', generatePrompt);
router.get('/history/:userId', getHistory);

export default router;