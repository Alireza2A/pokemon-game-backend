// import { connectDB } from './models/index.js';  // Commented out, since connectDB is not exported at the moment
import { sequelize } from './models/index.js';
import app from './app.js'; 
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';

dotenv.config();

console.log('Database URL:', process.env.DATABASE_URL);

const PORT = process.env.PORT || 5001;

// List of allowed origins (URLs)
const allowedOrigins = [
  'http://localhost:3000',   // Local development server
  'http://localhost:5173',   // Vite frontend server (local)
];

// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      // If the origin is in the allowed list or if no origin is provided (e.g., for server-side requests)
      callback(null, true);
    } else {
      // If the origin is not allowed, return an error
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Activate CORS and security middleware
app.use(cors(corsOptions));  // Use the configured CORS options
app.use(helmet());           // Apply Helmet for enhanced security

// Connect to the database
// connectDB().then(() => {
  initDatabase().then(() => {
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

// Simple error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});
