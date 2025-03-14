import express from 'express';
import { getleaderboard, addScore } from '../controllers/leaderboardController.js';

const router = express.Router();

// GET all scores
router.get('/', getleaderboard);

// POST new score
router.post('/', addScore);

export default router;
