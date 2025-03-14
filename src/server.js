import dotenv from 'dotenv';
import { connectDB } from './models/index.js';  
import { sequelize } from './models/index.js';
import app from './app.js'; // App importieren

dotenv.config();

console.log('Database URL:', process.env.DATABASE_URL);

const PORT = process.env.PORT || 5001;

// Connect to database
connectDB();

// Synchronise model with DB
sequelize.sync().then(() => {
  console.log('Database synchronized!');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
