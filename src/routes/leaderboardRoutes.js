import express from 'express';
import { getLeaderboard, addScore } from '../controllers/leaderboardController.js';

const router = express.Router();

// GET all scores
router.get('/', getLeaderboard);

// POST new score
router.post('/', addScore);

export default router;
