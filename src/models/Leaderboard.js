import { DataTypes } from 'sequelize';
import { sequelize } from './index.js';

const leaderboard = sequelize.define('leaderboard', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

export default leaderboard;
