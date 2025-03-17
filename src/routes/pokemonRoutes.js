import express from 'express';
import { getWildPokemon, getPokemon, updatePokemonStats } from '../controllers/pokemonController.js';
import { validatePokemonId, validatePokemonStats } from '../middleware/battleValidation.js';

const router = express.Router();

router.get('/wild', getWildPokemon);
router.get('/:id', validatePokemonId, getPokemon);
router.patch('/:id', validatePokemonStats, updatePokemonStats);

export default router; 