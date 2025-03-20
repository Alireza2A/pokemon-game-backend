import axios from 'axios';

// Base URL for PokeAPI
const POKE_API_URL = 'https://pokeapi.co/api/v2';

// Fetch a random Pokémon with given level
export const fetchRandomPokemon = async (level = 5) => {
  try {
    // Get a random Pokémon ID (from 1 to 151 for Gen 1)
    const randomId = Math.floor(Math.random() * 151) + 1;
    
    // Fetch Pokémon data from PokeAPI
    const response = await axios.get(`${POKE_API_URL}/pokemon/${randomId}`);
    const pokemonData = response.data;
    
    // Process and format the data
    const pokemon = {
      id: pokemonData.id,
      name: pokemonData.name,
      type: pokemonData.types.map(t => t.type.name),
      sprites: {
        front_default: pokemonData.sprites.front_default
      },
      baseStats: {
        hp: Math.floor((pokemonData.stats.find(s => s.stat.name === 'hp').base_stat * level) / 10) + 10,
        attack: Math.floor((pokemonData.stats.find(s => s.stat.name === 'attack').base_stat * level) / 10),
        defense: Math.floor((pokemonData.stats.find(s => s.stat.name === 'defense').base_stat * level) / 10),
        speed: Math.floor((pokemonData.stats.find(s => s.stat.name === 'speed').base_stat * level) / 10)
      },
      level: level
    };
    
    // Get 4 random moves
    const movesCount = Math.min(pokemonData.moves.length, 4);
    const randomMoves = [];
    
    // Get random unique indexes for moves
    const moveIndexes = new Set();
    while (moveIndexes.size < movesCount) {
      moveIndexes.add(Math.floor(Math.random() * pokemonData.moves.length));
    }
    
    // Add moves based on random indexes
    for (const index of moveIndexes) {
      const moveData = pokemonData.moves[index];
      randomMoves.push({
        name: moveData.move.name,
        url: moveData.move.url
      });
    }
    
    // Add moves to the Pokémon
    pokemon.moves = randomMoves;
    
    return pokemon;
  } catch (error) {
    console.error('Error fetching random Pokémon:', error);
    throw error;
  }
};

// Fetch move details from PokeAPI
export const fetchMoveDetails = async (moveUrl) => {
  try {
    const response = await axios.get(moveUrl);
    const moveData = response.data;
    
    return {
      id: moveData.id,
      name: moveData.name,
      type: moveData.type.name,
      power: moveData.power || 40, // Default power if null
      accuracy: moveData.accuracy,
      pp: moveData.pp
    };
  } catch (error) {
    console.error(`Error fetching move details for ${moveUrl}:`, error);
    throw error;
  }
}; 