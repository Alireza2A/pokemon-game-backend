import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const UserPokemon = sequelize.define('UserPokemon', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  pokemonId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Pokemons',
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  level: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  experience: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  currentHp: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  abilities: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: []
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'active'
  }
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['userId']
    },
    {
      fields: ['pokemonId']
    }
  ]
});

export default UserPokemon; 