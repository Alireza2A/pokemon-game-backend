import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
// dotenv.config();
dotenv.config({ path: './.env' });

// dotenv.config({ path: './.env' });
export const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
});

export async function connectDB() {
    try {
        await sequelize.authenticate();
        console.log('database connected successfully.');
    } catch (error) {
        console.error('database connection failed:', error);
        process.exit(1);
    }
}
