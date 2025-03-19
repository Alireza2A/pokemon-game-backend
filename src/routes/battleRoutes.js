import express from 'express';
import { getWildPokemon, recordBattleResult, getUserBattles } from '../controllers/battleController.js';

const router = express.Router();

// Get a wild Pokemon for battle
router.get('/wild/:id', getWildPokemon);

// Record battle result
router.post('/record', recordBattleResult);

// Get user's battle history
router.get('/user/:userId', getUserBattles);

export default router; 