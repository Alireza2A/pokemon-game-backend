import { Sequelize } from 'sequelize';

// Connect to Neon database
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  ssl: {
    rejectUnauthorized: false,
  },
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected!');
  } catch (error) {
    console.error('Database connection failed:', error);
  }
};

export { sequelize, connectDB };
