import models from '../models/index.js';

const { UserPokemon } = models;

export const addPokemonToRoster = async (req, res) => {
    try {
        const { pokemon_id, attack, defense, speed, hp, level, experience } = req.body;

        if (!pokemon_id) {
            return res.status(400).json({ message: 'Pokemon ID is required' });
        }

        const userPokemon = await UserPokemon.create({
            user_id: req.user.id, // Extract user ID from authenticated request
            pokemon_id,
            attack: attack, // Default values if not provided
            defense: defense,
            speed: speed,
            hp: hp,
            level: level,
            experience: experience,
        });

        res.status(201).json({ message: 'Pokemon added to roster', userPokemon });
    } catch (error) {
        console.error('Error adding Pokémon:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

export const removePokemonFromRoster = async (req, res) => {
    try {
        const { pokemon_id } = req.params;
        const result = await UserPokemon.destroy({ where: { user_id: req.user.id, pokemon_id } });

        if (!result) return res.status(404).json({ message: 'Pokemon not found in roster' });
        res.json({ message: 'Pokemon removed from roster' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getRoster = async (req, res) => {
    try {
        const roster = await UserPokemon.findAll({ where: { user_id: req.user.id } });
        res.json(roster);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
