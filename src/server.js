import dotenv from 'dotenv';
console.log('DATABASE_URL from server.js:', process.env.DATABASE_URL);
import express from 'express';
import { connectDB } from './db/index.js';
import cors from 'cors';
import helmet from 'helmet';
import logger from './middleware/logger.js';
import authMiddleware from './middleware/authMiddleware.js';
import errorHandler from './middleware/errorHandler.js';
//import routes
import authRoutes from './routes/authRoutes.js';
import userPokemonRoutes from './routes/userPokemonRoutes.js';
import abilityRoutes from './routes/abilityRoutes.js';
import battleRoutes from './routes/battleRoutes.js';
import leaderboardRoutes from './routes/leaderboardRoutes.js';
const PORT = process.env.PORT || 5001;

const app = express();
app.use(express.json());

dotenv.config();

// List of allowed origins (URLs)
const allowedOrigins = [
    'http://localhost:3000', // Local development server
    'http://localhost:5173', // Vite frontend server (local)
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

<<<<<<< HEAD
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
=======
// middleware
app.use(logger);
app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());

// Route handlers
app.use('/api/auth', authRoutes);

app.use('/api/userPokemon', authMiddleware, userPokemonRoutes);
app.use('/api/abilities', authMiddleware, abilityRoutes);
app.use('/api/battles', authMiddleware, battleRoutes);
app.use('/api/leaderboard', authMiddleware, leaderboardRoutes);
>>>>>>> 94065b860ca0059e485957564d7affe2fe2f557a

app.use(errorHandler);

const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => console.log(`server running on port ${PORT} ->  http://localhost:${PORT}/`));
};
startServer();
