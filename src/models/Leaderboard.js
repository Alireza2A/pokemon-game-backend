import { Sequelize, DataTypes } from 'sequelize';

// Verbinde direkt mit der Datenbank
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: false
});

const Leaderboard = sequelize.define('leaderboard', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  freezeTableName: true,
});

console.log("Table name in Sequelize model:", Leaderboard.getTableName());

export default Leaderboard;
