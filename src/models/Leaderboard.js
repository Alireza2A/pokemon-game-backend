import { DataTypes } from 'sequelize';
import { sequelize } from './index.js';

const Leaderboard = sequelize.define('leaderboard', {
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
}, {
  freezeTableName: true,  // Prevents sequelize to change table name to leaderboards
});

console.log("Table name in Sequelize model:", Leaderboard.getTableName());

export default Leaderboard;
