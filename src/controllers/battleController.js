import models from '../models/index.js';
import { fetchRandomPokemon } from '../services/pokeApiService.js';

const { Battle, Leaderboard, UserPokemon, UserPokemonAbility } = models;

// Get a wild Pokémon of specified level
export const getWildPokemon = async (req, res) => {
    try {
        const level = parseInt(req.params.level) || 5;
        
        // Validate level is between 1 and 100
        if (level < 1 || level > 100) {
            return res.status(400).json({ message: 'Level must be between 1 and 100' });
        }
        
        // Fetch random Pokémon data
        const wildPokemon = await fetchRandomPokemon(level);
        
        res.json(wildPokemon);
    } catch (error) {
        console.error('Error fetching wild Pokémon:', error);
        res.status(500).json({ 
            message: 'Failed to fetch wild Pokémon',
            error: error.message 
        });
    }
};

export const startBattle = async (req, res) => {
    try {
        const { pokemon_id, opponent_pokemon_id, result } = req.body; // "win" or "loss"
        const user_id = req.user.id;

        // Basic validation
        if (!opponent_pokemon_id || !result) {
            return res.status(400).json({ message: 'Missing battle details' });
        }

        // Ensure result is either "win" or "loss"
        if (!['win', 'loss'].includes(result)) {
            return res.status(400).json({ message: 'Invalid result. Must be "win" or "loss"' });
        }

        // Record the battle result
        const battle = await Battle.create({
            user_id,
            pokemon_id,
            opponent_pokemon_id,
            result,
            points_awarded: result === 'win' ? 1 : 0, // Assign points based on the result
            battle_date: new Date(), // Optionally track the battle date
        });

        // If the user won the battle, update the leaderboard score
        if (result === 'win') {
            let leaderboardEntry = await Leaderboard.findOne({ where: { user_id } });

            if (!leaderboardEntry) {
                leaderboardEntry = await Leaderboard.create({ user_id, score: 1 });
            } else {
                leaderboardEntry.score += 1;
                await leaderboardEntry.save();
            }
        }

        res.json({ message: 'Battle recorded successfully', battle });
    } catch (error) {
        console.error(error); // Log the error for better debugging
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Method to retrieve battle results for a user
export const getBattleResults = async (req, res) => {
    try {
        const user_id = req.user.id;

        // Fetch the user's battle results, joining with the UserPokemon table
        const battles = await Battle.findAll({
            where: { user_id },
            include: [
                {
                    model: UserPokemon,
                    as: 'userPokemon',
                    attributes: ['id', 'name'], // You can adjust attributes as needed
                },
                {
                    model: UserPokemon,
                    as: 'opponentPokemon',
                    attributes: ['id', 'name'], // You can adjust attributes as needed
                },
                {
                    model: UserPokemonAbility,
                    as: 'userPokemonAbility',
                    attributes: ['ability_id', 'effectiveness'], // Fetch Pokémon ability info
                },
            ],
            order: [['battle_date', 'DESC']], // Order by most recent battle
        });

        if (!battles.length) {
            return res.status(404).json({ message: 'No battle results found for this user' });
        }

        // Map the battle results to include more user-friendly information
        const results = battles.map((battle) => ({
            battle_id: battle.id,
            user_pokemon: battle.userPokemon.name,
            opponent_pokemon: battle.opponentPokemon.name,
            result: battle.result,
            points_awarded: battle.points_awarded,
            battle_date: battle.battle_date,
            user_pokemon_abilities: battle.userPokemonAbility.map((ability) => ({
                ability_id: ability.ability_id,
                effectiveness: ability.effectiveness,
            })),
        }));

        res.json(results);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
