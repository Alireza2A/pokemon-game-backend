import express from 'express';
import { recordBattle, getUserBattles, getBattleStats } from '../controllers/battleController.js';
import { validateBattleResult } from '../middleware/battleValidation.js';

const router = express.Router();

router.post('/', validateBattleResult, recordBattle);
router.get('/user/:userId', getUserBattles);
router.get('/stats/:userId', getBattleStats);

export default router; 