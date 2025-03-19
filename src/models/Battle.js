import { DataTypes } from 'sequelize';
import { sequelize } from './index.js';

const Battle = sequelize.define('Battle', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  playerPokemonId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Pokemons',
      key: 'id'
    }
  },
  wildPokemonId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Pokemons',
      key: 'id'
    }
  },
  result: {
    type: DataTypes.ENUM('won', 'lost'),
    allowNull: false
  },
  experienceGained: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  movesUsed: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: []
  },
  battleDuration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
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
      fields: ['playerPokemonId']
    },
    {
      fields: ['wildPokemonId']
    }
  ]
});

export default Battle; 