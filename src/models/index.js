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

// Define associations
User.hasMany(UserPokemon, { foreignKey: 'user_id', onDelete: 'CASCADE' });
UserPokemon.belongsTo(User, { foreignKey: 'user_id' });

UserPokemon.belongsToMany(Ability, { through: UserPokemonAbility, foreignKey: 'user_pokemon_id' });
Ability.belongsToMany(UserPokemon, { through: UserPokemonAbility, foreignKey: 'ability_id' });

User.hasMany(Battle, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Battle.belongsTo(User, { foreignKey: 'user_id' });

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
