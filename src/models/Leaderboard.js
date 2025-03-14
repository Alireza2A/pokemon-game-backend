import { DataTypes } from 'sequelize';
import { sequelize } from './index.js';

const Leaderboard = sequelize.define('Leaderboard', {
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

export default Leaderboard;
