import { connectDB } from './models/index.js';  
import { sequelize } from './models/index.js';
import app from './app.js'; 
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';

dotenv.config();

console.log('Database URL:', process.env.DATABASE_URL);

const PORT = process.env.PORT || 5001;

// Cors configuration
const corsOptions = {
  origin: 'http://localhost:3000', // URL of frontend app
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Activate Cors and safety middleware
app.use(cors(corsOptions));
app.use(helmet());

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

// simple error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});
