import { Sequelize } from 'sequelize';

// Test with hardcoded DATABASE_URL
const sequelize = new Sequelize('postgresql://PokemonBattleGame_owner:npg_L2eljRF7YsMg@ep-damp-forest-a2e5li68-pooler.eu-central-1.aws.neon.tech/PokemonBattleGame?sslmode=require', {
  dialect: 'postgres',
  ssl: {
    rejectUnauthorized: false,
  },
});

// Connect to Neon database (usual way, did not work properly, put the hardcoded db url instead)
// const sequelize = new Sequelize(process.env.DATABASE_URL, {
// dialect: 'postgres',
// ssl: {
// rejectUnauthorized: false,
// },
// });


const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected!');
  } catch (error) {
    console.error('Database connection failed:', error);
  }
};

export { sequelize, connectDB };
