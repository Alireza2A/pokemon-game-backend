import express from 'express';
import leaderboardRoutes from './routes/leaderboardRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Middleware for JSON parsing
app.use(express.json());

// Routes
app.use('/leaderboard', leaderboardRoutes);

// Error handler middleware
app.use(errorHandler);

export default app;
