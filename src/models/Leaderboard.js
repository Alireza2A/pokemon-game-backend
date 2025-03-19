import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const Leaderboard = sequelize.define(
        'Leaderboard',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique: true, // Each user has only one leaderboard entry
            },
            score: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    min: 0,
                },
            },
            //new col
            date: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            tableName: 'Leaderboard', // Explicitly set table name
            timestamps: false, // Disable createdAt/updatedAt timestamps
        }
    );

    return Leaderboard;
};
