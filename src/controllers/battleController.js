import Pokemon from '../models/Pokemon.js';
import Battle from '../models/Battle.js';
import { Op } from 'sequelize';

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
    // Get a random Pokemon from the database
    const wildPokemon = await Pokemon.findOne({
      order: sequelize.random(),
      where: {
        userId: null // Ensure it's not a user's Pokemon
      }
    });

    if (!wildPokemon) {
      return res.status(404).json({ message: "No wild Pokemon available" });
    }

    res.json(wildPokemon);
  } catch (error) {
    console.error("Error getting wild Pokemon:", error);
    res.status(500).json({ message: "Error getting wild Pokemon" });
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
export const recordBattle = async (req, res) => {
  try {
    const { userId, playerPokemonId, wildPokemonId, result, experienceGained, movesUsed, battleDuration, statusEffects } = req.body;

    // Start a transaction to ensure data consistency
    const battleResult = await sequelize.transaction(async (t) => {
      // Create battle record
      const battle = await Battle.create({
        userId,
        playerPokemonId,
        wildPokemonId,
        result,
        experienceGained,
        movesUsed,
        battleDuration,
        statusEffects
      }, { transaction: t });

      // Update player's Pokemon experience if battle was won
      if (result === 'won') {
        const playerPokemon = await Pokemon.findByPk(playerPokemonId, { transaction: t });
        if (playerPokemon) {
          await playerPokemon.update({
            experience: playerPokemon.experience + experienceGained
          }, { transaction: t });
        }
      }

      return battle;
    });

    res.status(201).json(battleResult);
  } catch (error) {
    console.error("Error recording battle:", error);
    res.status(500).json({ message: "Error recording battle" });
  }
};

// Get battle history for a user
export const getUserBattles = async (req, res) => {
  try {
    const { userId } = req.params;
    const battles = await Battle.findAll({
      where: { userId },
      include: [
        { model: Pokemon, as: 'playerPokemon' },
        { model: Pokemon, as: 'wildPokemon' }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(battles);
  } catch (error) {
    console.error("Error getting user battles:", error);
    res.status(500).json({ message: "Error getting user battles" });
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