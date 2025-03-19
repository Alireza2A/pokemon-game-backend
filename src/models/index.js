<<<<<<< HEAD
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
=======
import { sequelize } from '../db/index.js';
import UserModel from './user.js';
import UserPokemonModel from './userPokemon.js';
import AbilityModel from './ability.js';
import UserPokemonAbilityModel from './userPokemonAbility.js';
import BattleModel from './battle.js';
import LeaderboardModel from './leaderboard.js';

// Initialize models
const User = UserModel(sequelize);
const UserPokemon = UserPokemonModel(sequelize);
const Ability = AbilityModel(sequelize);
const UserPokemonAbility = UserPokemonAbilityModel(sequelize);
const Battle = BattleModel(sequelize);
const Leaderboard = LeaderboardModel(sequelize);
>>>>>>> 94065b860ca0059e485957564d7affe2fe2f557a

// Define associations
User.hasMany(UserPokemon, { foreignKey: 'user_id', onDelete: 'CASCADE' });
UserPokemon.belongsTo(User, { foreignKey: 'user_id' });

UserPokemon.belongsToMany(Ability, { through: UserPokemonAbility, foreignKey: 'user_pokemon_id' });
Ability.belongsToMany(UserPokemon, { through: UserPokemonAbility, foreignKey: 'ability_id' });

User.hasMany(Battle, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Battle.belongsTo(User, { foreignKey: 'user_id' });

<<<<<<< HEAD
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
=======
User.hasOne(Leaderboard, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Leaderboard.belongsTo(User, { foreignKey: 'user_id' });

// Ensuring all models are loaded correctly
const models = { User, UserPokemon, Ability, UserPokemonAbility, Battle, Leaderboard };
Object.entries(models).forEach(([name, model]) => {
    if (!model) {
        console.warn(`Warning: Model ${name} was not loaded correctly.`);
    } else {
        console.log(`Model ${name} loaded successfully.`);
    }
});

export default models;
>>>>>>> 94065b860ca0059e485957564d7affe2fe2f557a
