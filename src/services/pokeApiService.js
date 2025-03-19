import axios from 'axios';

const POKE_API_URL = 'https://pokeapi.co/api/v2';

export const fetchPokemonData = async (id) => {
  try {
    const response = await axios.get(`${POKE_API_URL}/pokemon/${id}`);
    const pokemon = response.data;

    // Transform PokeAPI data to our format
    return {
      name: pokemon.name,
      type: pokemon.types[0].type.name,
      baseStats: {
        hp: pokemon.stats[0].base_stat,
        attack: pokemon.stats[1].base_stat,
        defense: pokemon.stats[2].base_stat,
        speed: pokemon.stats[5].base_stat
      },
      moves: pokemon.moves.slice(0, 4).map(move => ({
        name: move.move.name,
        type: move.move.name.split('-')[0], // Simplified type mapping
        power: 40, // Default power since PokeAPI doesn't provide it directly
        accuracy: 100 // Default accuracy
      }))
    };
  } catch (error) {
    console.error('Error fetching Pokemon from PokeAPI:', error);
    throw error;
  }
};

export const fetchRandomPokemon = async () => {
  try {
    // Get a random Pokemon ID (1-151 for first gen)
    const randomId = Math.floor(Math.random() * 151) + 1;
    return await fetchPokemonData(randomId);
  } catch (error) {
    console.error('Error fetching random Pokemon:', error);
    throw error;
  }
}; 