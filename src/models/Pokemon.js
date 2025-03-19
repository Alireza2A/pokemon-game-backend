import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Pokemon = sequelize.define('Pokemon', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  baseStats: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {
      hp: 100,
      attack: 50,
      defense: 50,
      speed: 50
    }
  },
  moves: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: []
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true
});

export default Pokemon; 