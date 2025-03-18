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
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);  // Allow the origin
    } else {
      const error = new Error('Not allowed by CORS');
      error.status = 403;  // Set status to 403 if not allowed
      callback(error, false);  // Pass error to next middleware
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200, 
};

// Activate CORS middleware
app.use(cors(corsOptions));  // Use the configured CORS options

// Activate Helmet for enhanced security
app.use(helmet());           // Apply Helmet for security headers

// Connect to the database
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch((error) => {
  console.error('Error connecting to the database:', error);
});

// Simple error handling middleware
app.use((err, req, res, next) => {
  if (err.status === 403) {  // Check if the error is CORS-related
    res.status(403).json({ message: 'CORS policy: Access denied' });
  } else {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
  }
});
