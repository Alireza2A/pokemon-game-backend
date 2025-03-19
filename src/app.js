import express from 'express';
import cors from 'cors';
import leaderboardRoutes from './routes/leaderboardRoutes.js';
import battleRoutes from './routes/battleRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/leaderboard', leaderboardRoutes);
app.use('/api/battle', battleRoutes);

// Error handler middleware
app.use(errorHandler);

export default app;
