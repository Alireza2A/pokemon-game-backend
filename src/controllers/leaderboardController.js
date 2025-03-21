import models from '../models/index.js';
const { User, Leaderboard, UserPokemon } = models;

export const getLeaderboard = async (req, res) => {
    try {
        // Find all leaderboard entries ordered by score
        const leaderboard = await Leaderboard.findAll({
            include: [
                {
                    model: User,
                    attributes: ['id', 'username'],
                    include: [
                        {
                            model: UserPokemon,
                            attributes: ['id', 'name', 'level', 'sprites'],
                        }
                    ]
                }
            ],
            order: [['score', 'DESC']]
        });

        // Transform the data for frontend consumption
        const formattedLeaderboard = leaderboard.map((entry, index) => {
            const user = entry.User || {};
            const team = user.UserPokemons || [];
            
            return {
                id: entry.user_id,
                username: user.username || `Player ${entry.user_id}`,
                rank: index + 1, // Position based on ordered results
                score: entry.score || 0,
                wins: entry.wins || 0,
                losses: entry.losses || 0,
                winLossRatio: (entry.wins + entry.losses) > 0 
                    ? (entry.wins / (entry.wins + entry.losses)).toFixed(2) 
                    : '0.00',
                team: team.map(pokemon => ({
                    id: pokemon.id,
                    name: pokemon.name,
                    level: pokemon.level,
                    sprites: pokemon.sprites
                })),
                characterIcon: user.characterIcon || null,
                lastActive: entry.last_battle_date || null
            };
        });

        res.json(formattedLeaderboard);
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({ 
            message: 'Server error fetching leaderboard', 
            error: error.message 
        });
    }
};

export const updateScore = async (req, res) => {
    try {
        const { user_id, score, wins, losses } = req.body;

        if (!user_id || score === undefined) {
            return res.status(400).json({ message: 'User ID and score are required' });
        }

        // Find the leaderboard entry for the user
        let leaderboardEntry = await Leaderboard.findOne({
            where: { user_id }
        });

        if (!leaderboardEntry) {
            // Create a new entry if it doesn't exist
            leaderboardEntry = await Leaderboard.create({ 
                user_id, 
                score, 
                wins: wins || 0,
                losses: losses || 0,
                win_streak: wins > 0 ? wins : 0,
                last_battle_date: new Date()
            });
        } else {
            // Update the existing entry
            leaderboardEntry.score = score;
            if (wins !== undefined) leaderboardEntry.wins = wins;
            if (losses !== undefined) leaderboardEntry.losses = losses;
            
            // Calculate win streak (optional)
            if (wins > leaderboardEntry.wins) {
                leaderboardEntry.win_streak += (wins - leaderboardEntry.wins);
            } else if (losses > leaderboardEntry.losses) {
                leaderboardEntry.win_streak = 0; // Reset streak on new loss
            }
            
            leaderboardEntry.last_battle_date = new Date();
            await leaderboardEntry.save();
        }

        res.json({ 
            message: 'Leaderboard score updated', 
            leaderboard: leaderboardEntry 
        });
    } catch (error) {
        console.error('Error updating leaderboard score:', error);
        res.status(500).json({ 
            message: 'Server error updating leaderboard', 
            error: error.message 
        });
    }
};
