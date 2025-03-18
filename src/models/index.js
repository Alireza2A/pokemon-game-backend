import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
import sequelize from '../config/db.js'; // Sequelize client from config/db.js

// Import models (non existing models temporarily commented out)
import { default as Leaderboard } from './Leaderboard.js';
// import User from './models/User.js'; // to be created
// import Pokemon from './models/Pokemon.js'; // to be created
// import Battle from './models/Battle.js'; // to be created

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in environment variables');
}

console.log('Loaded DATABASE_URL:', process.env.DATABASE_URL);

// No new sequelize client needed, since that one is already in config/db.js
// const sequelize = new Sequelize(process.env.DATABASE_URL, {
//   dialect: 'postgres',
//   dialectOptions: {
//     ssl: {
//       require: true,
//       rejectUnauthorized: false
//     }
//   },
//   logging: false // Set to console.log to see SQL queries
// });

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

// Export models
export { sequelize, Leaderboard };

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
