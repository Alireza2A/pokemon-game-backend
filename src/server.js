import { connectDB } from './models/index.js';  
import { sequelize } from './models/index.js';
import app from './app.js'; 
import dotenv from 'dotenv';


dotenv.config();

console.log('Database URL:', process.env.DATABASE_URL);

const PORT = process.env.PORT || 5001;

// Connect to database
connectDB().then(() => {
  
  sequelize.sync().then(() => {
    console.log('Database synchronized!');

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }).catch((error) => {
    console.error('Error syncing database:', error);
  });
}).catch((error) => {
  console.error('Error connecting to the database:', error);
});
