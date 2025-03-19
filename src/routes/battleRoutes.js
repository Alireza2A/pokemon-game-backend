import express from 'express';
import { startBattle, getBattleResults } from '../controllers/battleController.js';

const router = express.Router();

router.post('/start', startBattle);
router.get('/results', getBattleResults);

export default router;
