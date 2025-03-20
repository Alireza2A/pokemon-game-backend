import express from 'express';
import { startBattle, getBattleResults, getWildPokemon } from '../controllers/battleController.js';

const router = express.Router();

router.post('/start', startBattle);
router.get('/results', getBattleResults);
router.get('/wild/:level', getWildPokemon);

export default router;
