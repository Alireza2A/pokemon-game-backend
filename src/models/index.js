import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
import sequelize from '../config/db.js'; // Sequelize client from config/db.js
import User from './User.js';
import Pokemon from './Pokemon.js';
import UserPokemon from './UserPokemon.js';
import Battle from './Battle.js';
import Leaderboard from './Leaderboard.js';

// Import models (non existing models temporarily commented out)
// import { default as Leaderboard } from './Leaderboard.js';
// import User from './models/User.js'; // to be created
// import Pokemon from './models/Pokemon.js'; // to be created
// import Battle from './models/Battle.js'; // to be created

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in environment variables');
}

console.log('Loaded DATABASE_URL:', process.env.DATABASE_URL);

const sequelizeClient = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

// Define relationships
User.hasMany(UserPokemon);
UserPokemon.belongsTo(User);

Pokemon.hasMany(UserPokemon);
UserPokemon.belongsTo(Pokemon);

User.hasMany(Battle);
Battle.belongsTo(User);

UserPokemon.hasMany(Battle, { foreignKey: 'pokemonId' });
Battle.belongsTo(UserPokemon, { foreignKey: 'pokemonId' });

Pokemon.hasMany(Battle, { foreignKey: 'opponentPokemonId' });
Battle.belongsTo(Pokemon, { foreignKey: 'opponentPokemonId' });

// Initialize database
export async function initDatabase() {
  try {
    await sequelizeClient.authenticate();
    console.log('Database connection established successfully.');
    
    // Sync all models
    await sequelizeClient.sync({ alter: true });
    console.log('Database models synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
}

export { sequelizeClient, User, Pokemon, UserPokemon, Battle, Leaderboard };
