import express from 'express';
import leaderboardRoutes from './routes/leaderboardRoutes.js';
import battleRoutes from './routes/battleRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import cors from 'cors';

const app = express();

// Enable CORS
app.use(cors());

// Middleware for JSON parsing
app.use(express.json());

// Routes
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/battle', battleRoutes);

// Error handler middleware
app.use(errorHandler);

export default app;
