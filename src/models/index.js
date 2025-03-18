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

// Import models (temporarily commented out)
// import User from './User.js'; // to be created
// import Pokemon from './Pokemon.js'; // to be created
// import Battle from './Battle.js'; // to be created
import Leaderboard from './Leaderboard.js';

// Define relationships (commented out since the models are not available yet)
// User.hasMany(Pokemon, {
//   foreignKey: 'userId',
//   as: 'pokemon'
// });
// Pokemon.belongsTo(User, {
//   foreignKey: 'userId'
// });

// User.hasMany(Battle, {
//   foreignKey: 'userId',
//   as: 'battles'
// });
// Battle.belongsTo(User, {
//   foreignKey: 'userId'
// });

// Battle.belongsTo(Pokemon, {
//   foreignKey: 'playerPokemonId',
//   as: 'playerPokemon'
// });
// Battle.belongsTo(Pokemon, {
//   foreignKey: 'wildPokemonId',
//   as: 'wildPokemon'
// });

// Export models (commented out since the models are not available yet)
// export { User, Pokemon, Battle, Leaderboard };


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
