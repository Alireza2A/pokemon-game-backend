<<<<<<< HEAD
import { User, UserPokemon, Pokemon, Battle } from '../models/index.js';
import { Op } from 'sequelize';
import { fetchPokemonData } from '../services/pokeApiService.js';

// Helper function to calculate HP based on level
const calculateHp = (level) => {
  return 100 + (level - 1) * 5;
};

// Helper function to generate random moves
const generateMoves = () => {
  const movePool = [
    { name: 'Tackle', power: 40 },
    { name: 'Scratch', power: 40 },
    { name: 'Quick Attack', power: 40 },
    { name: 'Pound', power: 40 },
    { name: 'Bite', power: 60 },
    { name: 'Ember', power: 40 },
    { name: 'Water Gun', power: 40 },
    { name: 'Vine Whip', power: 45 }
  ];
  
  const numMoves = Math.floor(Math.random() * 4) + 1; // 1-4 moves
  const moves = [];
  const usedIndices = new Set();
  
  while (moves.length < numMoves) {
    const index = Math.floor(Math.random() * movePool.length);
    if (!usedIndices.has(index)) {
      usedIndices.add(index);
      moves.push({
        id: `move-${moves.length + 1}`,
        name: movePool[index].name,
        power: movePool[index].power
      });
    }
  }
  
  return moves;
};

// Get a random wild Pokemon
export const getWildPokemon = async (req, res) => {
  try {
    const { id } = req.params;
    const wildPokemon = await fetchPokemonData(id);

    if (!wildPokemon) {
      return res.status(404).json({ error: 'Wild Pokemon not found' });
    }

    // Add current HP for battle
    const pokemonWithHp = {
      ...wildPokemon,
      currentHp: wildPokemon.baseStats.hp
    };

    res.json(pokemonWithHp);
  } catch (error) {
    console.error('Error fetching wild pokemon:', error);
    res.status(500).json({ error: 'Failed to fetch wild pokemon' });
  }
};

// Get Pokemon details
export const getPokemon = async (req, res) => {
  try {
    const { id } = req.params;
    const pokemon = await Pokemon.findByPk(id);

    if (!pokemon) {
      return res.status(404).json({ message: "Pokemon not found" });
    }

    res.json(pokemon);
  } catch (error) {
    console.error("Error getting Pokemon:", error);
    res.status(500).json({ message: "Error getting Pokemon" });
  }
};

// Update Pokemon stats after battle
export const updatePokemonStats = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentHp, level, experience } = req.body;

    const pokemon = await Pokemon.findByPk(id);
    if (!pokemon) {
      return res.status(404).json({ message: "Pokemon not found" });
    }

    await pokemon.update({
      currentHp,
      level,
      experience
    });

    res.json(pokemon);
  } catch (error) {
    console.error("Error updating Pokemon stats:", error);
    res.status(500).json({ message: "Error updating Pokemon stats" });
  }
};

// Record battle result
export const recordBattleResult = async (req, res) => {
  try {
    const { userId, pokemonId, opponentPokemonId, winner, loser } = req.body;
    
    // Calculate score change (example: +10 for win, -5 for loss)
    const scoreChange = winner === 'user' ? '+10' : '-5';
    
    // Get current user score
    const user = await User.findByPk(userId);
    const currentScore = user.score;
    
    // Calculate new score
    const newScore = winner === 'user' 
      ? currentScore + 10 
      : Math.max(0, currentScore - 5);

    // Update user score
    await user.update({ score: newScore });

    // Record battle
    const battle = await Battle.create({
      userId,
      pokemonId,
      opponentPokemonId,
      winner,
      loser,
      scoreChange,
      newScore
    });

    res.json({
      message: 'Battle recorded successfully',
      battle,
      newScore
    });
  } catch (error) {
    console.error('Error recording battle:', error);
    res.status(500).json({ error: 'Failed to record battle' });
  }
};

// Get battle history for a user
export const getUserBattles = async (req, res) => {
  try {
    const userId = req.params.userId;
    const battles = await Battle.findAll({
      where: { userId },
      include: [
        {
          model: UserPokemon,
          attributes: ['id', 'name']
        },
        {
          model: Pokemon,
          as: 'opponentPokemon',
          attributes: ['id', 'name']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(battles);
  } catch (error) {
    console.error('Error fetching user battles:', error);
    res.status(500).json({ error: 'Failed to fetch user battles' });
  }
};

// Get battle statistics for a user
export const getBattleStats = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const stats = await Battle.findAll({
      where: { userId },
      attributes: [
        'result',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['result']
    });

    const totalBattles = stats.reduce((acc, curr) => acc + parseInt(curr.get('count')), 0);
    const wins = stats.find(s => s.get('result') === 'won')?.get('count') || 0;
    const losses = stats.find(s => s.get('result') === 'lost')?.get('count') || 0;

    res.json({
      totalBattles,
      wins,
      losses,
      winRate: totalBattles > 0 ? (wins / totalBattles) * 100 : 0
    });
  } catch (error) {
    console.error("Error getting battle stats:", error);
    res.status(500).json({ message: "Error getting battle stats" });
  }
}; 
=======
import models from '../models/index.js';

const { Battle, Leaderboard, UserPokemon, UserPokemonAbility } = models;

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
>>>>>>> 94065b860ca0059e485957564d7affe2fe2f557a
