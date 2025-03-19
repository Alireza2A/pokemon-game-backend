import express from 'express';
<<<<<<< HEAD
import { getWildPokemon, recordBattleResult, getUserBattles } from '../controllers/battleController.js';

const router = express.Router();

// Get a wild Pokemon for battle
router.get('/wild/:id', getWildPokemon);

// Record battle result
router.post('/record', recordBattleResult);

// Get user's battle history
router.get('/user/:userId', getUserBattles);
=======
import { startBattle, getBattleResults } from '../controllers/battleController.js';

const router = express.Router();

router.post('/start', startBattle);
router.get('/results', getBattleResults);
>>>>>>> 94065b860ca0059e485957564d7affe2fe2f557a

export default router;
