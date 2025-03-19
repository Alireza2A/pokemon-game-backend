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
                allowNull: false,
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
        },
        {
            tableName: 'Battles',
            timestamps: false,
        }
    );

    return Battle;
};
