import express from 'express';
import { updatePokemonAbility, addAbilityToUserPokemon } from '../controllers/abilityController.js';

const router = express.Router();

router.post('/add', addAbilityToUserPokemon);
router.put('/update/:pokemon_id', updatePokemonAbility);
export default router;
