import models from '../models/index.js';

const { UserPokemonAbility, UserPokemon } = models;

export const updatePokemonAbility = async (req, res) => {
    try {
        const { user_pokemon_id, ability_id, new_value } = req.body;
        const ability = await UserPokemonAbility.findOne({ where: { user_pokemon_id, ability_id } });

        if (!ability) return res.status(404).json({ message: 'Ability not found' });

        ability.value = new_value;
        await ability.save();

        res.json({ message: 'Ability updated', ability });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
export const addAbilityToUserPokemon = async (req, res) => {
    try {
        const { user_pokemon_id, ability_id, value } = req.body;
        console.log('here');
        if (!user_pokemon_id || !ability_id) {
            return res.status(400).json({ message: 'User Pokémon ID and Ability ID are required' });
        }

        // Check if the UserPokemon exists
        const userPokemon = await UserPokemon.findByPk(user_pokemon_id);
        if (!userPokemon) {
            return res.status(404).json({ message: 'User Pokémon not found' });
        }

        // Add ability to UserPokemon
        const userPokemonAbility = await UserPokemonAbility.create({
            user_pokemon_id,
            ability_id,
            value: value || 0, // Default value if not provided
        });

        res.status(201).json({
            message: 'Ability added to Pokémon',
            userPokemonAbility,
        });
    } catch (error) {
        console.error('Error adding ability:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};
