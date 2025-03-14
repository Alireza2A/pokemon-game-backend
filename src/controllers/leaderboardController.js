import Leaderboard from '../models/Leaderboard.js';

// GET Leaderboard
export const getLeaderboard = async (req, res) => {
  try {
    const scores = await Leaderboard.findAll();
    res.json(scores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST New Score
export const addScore = async (req, res) => {
  const { username, score } = req.body;

  try {
    const newScore = await Leaderboard.create({ username, score });
    res.status(201).json(newScore);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
