import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in environment variables');
}

export const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: false // Set to console.log to see SQL queries
});

// Import models
import User from './User.js';
import Pokemon from './Pokemon.js';
import Battle from './Battle.js';
import Leaderboard from './Leaderboard.js';

// Define relationships
User.hasMany(Pokemon);
Pokemon.belongsTo(User);

User.hasMany(Battle);
Battle.belongsTo(User, { as: 'user' });

Pokemon.hasMany(Battle, { foreignKey: 'playerPokemonId', as: 'playerBattles' });
Pokemon.hasMany(Battle, { foreignKey: 'wildPokemonId', as: 'wildBattles' });
Battle.belongsTo(Pokemon, { foreignKey: 'playerPokemonId', as: 'playerPokemon' });
Battle.belongsTo(Pokemon, { foreignKey: 'wildPokemonId', as: 'wildPokemon' });

// Export models
export { User, Pokemon, Battle, Leaderboard };

// Initialize database
export async function initDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Sync all models
    await sequelize.sync({ alter: true });
    console.log('Database models synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
}
