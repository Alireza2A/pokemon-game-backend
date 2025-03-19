import { User, UserPokemon, Pokemon, Battle } from '../models/index.js';

export const getUserPokemons = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user is authenticated
    const userPokemons = await UserPokemon.findAll({
      where: { userId },
      include: [{
        model: Pokemon,
        attributes: ['id', 'name', 'type', 'baseStats']
      }]
    });

    const user = await User.findByPk(userId, {
      attributes: ['id', 'name', 'score']
    });

    res.json({
      user,
      pokemons: userPokemons.map(up => ({
        id: up.id,
        name: up.name,
        abilities: up.abilities,
        pokemon: up.Pokemon
      }))
    });
  } catch (error) {
    console.error('Error fetching user pokemons:', error);
    res.status(500).json({ error: 'Failed to fetch user pokemons' });
  }
};

export const addPokemonToRoster = async (req, res) => {
  try {
    const { pokemonId, name, abilities } = req.body;
    const userId = req.user.id;

    const userPokemon = await UserPokemon.create({
      userId,
      pokemonId,
      name,
      abilities: abilities || []
    });

    res.json({
      message: 'Pokemon added to roster successfully',
      userPokemon
    });
  } catch (error) {
    console.error('Error adding pokemon to roster:', error);
    res.status(500).json({ error: 'Failed to add pokemon to roster' });
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    const topPlayers = await User.findAll({
      attributes: ['id', 'name', 'score'],
      order: [['score', 'DESC']],
      limit: 10
    });

    res.json(topPlayers);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
}; 