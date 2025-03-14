import leaderboard from '../models/leaderboard';

// GET leaderboard
export const getleaderboard = async (req, res) => {
  try {
    const scores = await leaderboard.findAll();
    res.json(scores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST New Score
export const addScore = async (req, res) => {
  const { username, score } = req.body;

  try {
    const newScore = await leaderboard.create({ username, score });
    res.status(201).json(newScore);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
