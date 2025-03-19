import express from 'express';
import { addPokemonToRoster, removePokemonFromRoster, getRoster } from '../controllers/userPokemonController.js';

const router = express.Router();

router.post('/add', addPokemonToRoster);
router.delete('/remove/:pokemon_id', removePokemonFromRoster);
router.get('/', getRoster);

export default router;
