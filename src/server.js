import dotenv from 'dotenv';
dotenv.config();

import helmet from 'helmet';
import cors from 'cors';
import { initDatabase } from './models/index.js';
import app from './app.js';

const PORT = process.env.PORT || 5001;

// List of allowed origins (URLs)
const allowedOrigins = [
  'http://localhost:3000',   // Local development server
  'http://localhost:5173',   // Vite frontend server (local)
];

// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    console.log('Incoming request from origin:', origin); // Debugging

    if (origin && allowedOrigins.includes(origin)) {
      callback(null, true);  // Allow the origin
    } else {
      const error = new Error('Not allowed by CORS');
      error.status = 403;  
      callback(error, false);  
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200, 
};


// Activate CORS middleware (should come before Helmet)
app.use(cors(corsOptions));

// Activate Helmet for enhanced security
app.use(helmet());

// Define the Content Security Policy (CSP)
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"], // Allow same-origin resources
      imgSrc: ["'self'", "http://localhost:5001"], // Allow favicon.ico
      styleSrc: ["'self'", "'unsafe-inline'"], // Allow inline styles (for TailwindCSS, DaisyUI)
      scriptSrc: ["'self'", "'unsafe-inline'"], // Allow inline scripts (if needed)
      connectSrc: ["'self'"], // Allow API requests
    },
  })
);

// Connect to the database
initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Error connecting to the database:', error);
  });

// Simple error handling middleware (must be after all routes)
app.use((err, req, res, next) => {
  if (err.message === 'Not allowed by CORS') {
    res.status(403).json({ message: 'CORS policy: Access denied' });
  } else {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
  }
});
