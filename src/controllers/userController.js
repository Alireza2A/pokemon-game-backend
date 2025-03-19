<<<<<<< HEAD
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
=======
import models from '../models/index.js';

const { User } = models;
export const getAllUsers = async (req, res) => {
    try {
        const allUsers = await User.findAll();
        res.status(200).json({ success: true, data: allUsers });
    } catch (error) {
        console.error('error by fetching all users:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

export const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log('User data:', name, email, password);
        const newUser = await User.create({ name, email, password });
        res.status(201).json({ success: true, data: newUser });
    } catch (error) {
        console.error('error by creating a User:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const searchedUser = await User.findByPk(id);
        if (!searchedUser) {
            return res.status(404).json({ success: false, error: 'User not found' });
        } else {
            console.log('User data:', searchedUser.name, searchedUser.email, searchedUser.password);
            res.status(200).json({ success: true, data: searchedUser });
        }
    } catch (error) {
        console.error('error by getting a User:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('User id:', id);
        const { name, email, password } = req.body;
        const updatedUser = await User.findByPk(id);
        if (!updatedUser) {
            return res.status(404).json({ success: false, error: 'User not found' });
        } else {
            await updatedUser.update({ name, email, password });
            res.status(200).json({ success: true, data: updatedUser });
        }
    } catch (error) {
        console.error('error by updating a User:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('User id:', id);
        const findUser = await User.findByPk(id);

        if (!findUser) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        await findUser.destroy({ where: { id } });
        console.log('The User was succsessfully deleted!');
        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
            data: findUser,
        });
    } catch (error) {
        console.error('error by deleting a User:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};
>>>>>>> 94065b860ca0059e485957564d7affe2fe2f557a
