import dotenv from 'dotenv';
dotenv.config();

console.log('DATABASE_URL from server.js:', process.env.DATABASE_URL);

import { initDatabase } from './models/index.js';
import app from './app.js'; 
import cors from 'cors';
import helmet from 'helmet';

const PORT = process.env.PORT || 5001;

// List of allowed origins (URLs)
const allowedOrigins = [
  'http://localhost:3000',   // Local development server
  'http://localhost:5173',   // Vite frontend server (local)
];

// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Activate CORS middleware
app.use(cors(corsOptions));

// Activate Helmet for enhanced security
app.use(helmet());

// Connect to the database
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch((error) => {
  console.error('Error connecting to the database:', error);
  process.exit(1);
});

// Simple error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});
