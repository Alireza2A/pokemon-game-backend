import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const UserPokemon = sequelize.define(
        'UserPokemon',
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
                // Pokemon ID from the external API
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            attack: DataTypes.INTEGER,
            defense: DataTypes.INTEGER,
            speed: DataTypes.INTEGER,
            hp: DataTypes.INTEGER,
            level: {
                type: DataTypes.INTEGER,
                defaultValue: 1,
            },
            experience: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },
        },
        {
            tableName: 'UserPokemon',
            timestamps: false,
        }
    );

    return UserPokemon;
};
