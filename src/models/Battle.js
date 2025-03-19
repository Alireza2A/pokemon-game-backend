import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Battle = sequelize.define('Battle', {
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
      model: 'UserPokemons',
      key: 'id'
    }
  },
  opponentPokemonId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Pokemons',
      key: 'id'
    }
  },
  winner: {
    type: DataTypes.ENUM('user', 'opponent'),
    allowNull: false
  },
  loser: {
    type: DataTypes.ENUM('user', 'opponent'),
    allowNull: false
  },
  scoreChange: {
    type: DataTypes.STRING,
    allowNull: false
  },
  newScore: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  battleDuration: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  movesUsed: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: []
  },
  statusEffects: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: []
  }
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['userId']
    },
    {
      fields: ['pokemonId']
    },
    {
      fields: ['opponentPokemonId']
    }
  ]
});

export default Battle; 