import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const Battle = sequelize.define(
        'Battle',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            pokemon_id: {
                // The user's Pokémon ID (from the API)
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            opponent_pokemon_id: {
                // Opponent's Pokémon ID (from the API)
                type: DataTypes.INTEGER,
                allowNull: true, // Make nullable for wild Pokémon
            },
            opponent_is_wild: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            opponent_name: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            opponent_level: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            result: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isIn: [['win', 'loss']],
                },
            },
            points_awarded: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            battle_date: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
            moves_used: {
                type: DataTypes.JSON,
                allowNull: true,
            },
            battle_duration: {
                type: DataTypes.INTEGER, // in seconds
                allowNull: true,
            },
            status_effects: {
                type: DataTypes.JSON,
                allowNull: true,
            },
        },
        {
            tableName: 'Battles',
            timestamps: false,
        }
    );

    return Battle;
};
