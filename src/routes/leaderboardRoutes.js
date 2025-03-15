import express from 'express';
import { getleaderboard, addScore } from '../controllers/leaderboardController.js';

const router = express.Router();

router.get('/', getleaderboard);
router.post('/', addScore);

export default router;
