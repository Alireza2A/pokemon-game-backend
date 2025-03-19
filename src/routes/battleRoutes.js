import express from 'express';
import { body } from 'express-validator';
import {
  getWildPokemon,
  getPokemon,
  updatePokemonStats,
  recordBattle,
  getUserBattles,
  getBattleStats
} from '../controllers/battleController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get wild Pokemon
router.get('/pokemon/wild', getWildPokemon);

// Get Pokemon details
router.get('/pokemon/:id', getPokemon);

// Update Pokemon stats
router.patch('/pokemon/:id', [
  auth,
  body('currentHp').isInt({ min: 0 }),
  body('level').isInt({ min: 1, max: 100 }),
  body('experience').isInt({ min: 0 })
], updatePokemonStats);

// Record battle result
router.post('/battles', [
  auth,
  body('userId').isUUID(),
  body('playerPokemonId').isUUID(),
  body('wildPokemonId').isUUID(),
  body('result').isIn(['won', 'lost']),
  body('experienceGained').isInt({ min: 0 }),
  body('movesUsed').isArray(),
  body('battleDuration').isInt({ min: 0 }),
  body('statusEffects').isArray()
], recordBattle);

// Get battle history for a user
router.get('/battles/user/:userId', getUserBattles);

// Get battle statistics for a user
router.get('/battles/stats/:userId', getBattleStats);

export default router; 