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