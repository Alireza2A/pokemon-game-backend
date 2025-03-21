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
        const { 
            pokemon_id, 
            opponent_pokemon_id, 
            result, 
            user_id: bodyUserId,
            battle_duration,
            moves_used,
            status_effects,
            opponent_is_wild,
            opponent_name,
            opponent_level
        } = req.body;
        
        // Get user_id from req.user if available, or from request body as fallback
        const user_id = req.user?.id || bodyUserId || 1; // Default to 1 if not available

        // Basic validation
        if (!result) {
            return res.status(400).json({ message: 'Missing battle result' });
        }

        // Ensure result is either "win" or "loss"
        if (!['win', 'loss'].includes(result)) {
            return res.status(400).json({ message: 'Invalid result. Must be "win" or "loss"' });
        }

        // Check if this is a wild Pokémon battle
        const isWildPokemon = opponent_is_wild || 
            (typeof opponent_pokemon_id === 'string' && opponent_pokemon_id.startsWith('wild_'));
        
        // Extract wild Pokémon info from ID if needed
        let wildPokemonName, wildPokemonLevel;
        if (isWildPokemon && typeof opponent_pokemon_id === 'string' && !opponent_name) {
            const parts = opponent_pokemon_id.split('_');
            if (parts.length >= 3) {
                wildPokemonName = parts[1];
                wildPokemonLevel = parseInt(parts[2]) || 5;
            }
        }

        console.log('Creating battle record with:', { 
            user_id, 
            pokemon_id, 
            opponent_pokemon_id,
            isWildPokemon,
            opponent_name: opponent_name || wildPokemonName,
            opponent_level: opponent_level || wildPokemonLevel,
            result 
        });

        // Record the battle result
        const battle = await Battle.create({
            user_id,
            pokemon_id: pokemon_id || 1, // Provide a default if missing
            opponent_pokemon_id: isWildPokemon ? null : opponent_pokemon_id,
            opponent_is_wild: isWildPokemon,
            opponent_name: opponent_name || wildPokemonName,
            opponent_level: opponent_level || wildPokemonLevel,
            result,
            points_awarded: result === 'win' ? 10 : 0,
            battle_date: new Date(),
            battle_duration: battle_duration || 0,
            moves_used: moves_used || [],
            status_effects: status_effects || []
        });

        // Update the leaderboard entry
        let leaderboardEntry = await Leaderboard.findOne({ where: { user_id } });
        
        if (!leaderboardEntry) {
            // Create new leaderboard entry if it doesn't exist
            leaderboardEntry = await Leaderboard.create({ 
                user_id, 
                score: result === 'win' ? 10 : 0,
                wins: result === 'win' ? 1 : 0,
                losses: result === 'win' ? 0 : 1,
                win_streak: result === 'win' ? 1 : 0,
                last_battle_date: new Date()
            });
        } else {
            // Update existing leaderboard entry
            if (result === 'win') {
                leaderboardEntry.score += 10;
                leaderboardEntry.wins += 1;
                leaderboardEntry.win_streak += 1;
            } else {
                leaderboardEntry.losses += 1;
                leaderboardEntry.win_streak = 0; // Reset win streak on loss
            }
            leaderboardEntry.last_battle_date = new Date();
            await leaderboardEntry.save();
        }

        res.json({ 
            message: 'Battle recorded successfully', 
            battle,
            leaderboard: {
                score: leaderboardEntry.score,
                wins: leaderboardEntry.wins,
                losses: leaderboardEntry.losses,
                win_streak: leaderboardEntry.win_streak
            }
        });
    } catch (error) {
        console.error('Error recording battle:', error);
        res.status(500).json({ 
            message: 'Server error recording battle', 
            errorType: error.name,
            errorMessage: error.message,
            // Include more details if available
            validationErrors: error.errors ? error.errors.map(e => ({
                field: e.path,
                message: e.message
            })) : null
        });
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
