import models from '../models/index.js';
const { Leaderboard } = models;

export const getLeaderboard = async (req, res) => {
    try {
        const leaderboard = await Leaderboard.findAll({
            order: [['score', 'DESC']],
            limit: 10,
        });
        res.json(leaderboard);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const updateScore = async (req, res) => {
    try {
        const { score } = req.body;
        const user_id = req.user.id;

        if (score === undefined || score === null) {
            return res.status(400).json({ message: 'Score is required' });
        }

        // Find the leaderboard entry for the user
        let leaderboardEntry = await Leaderboard.findOne({
            where: { user_id },
        });

        if (!leaderboardEntry) {
            // If the user does not have an entry, create a new one
            leaderboardEntry = await Leaderboard.create({ user_id, score });
        } else {
            // If the user already has an entry, update their score
            leaderboardEntry.score = score;
            await leaderboardEntry.save();
        }

        res.json({ message: 'Leaderboard score updated', leaderboardEntry });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
