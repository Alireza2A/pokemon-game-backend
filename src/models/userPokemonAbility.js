import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const UserPokemonAbility = sequelize.define(
        'UserPokemonAbility',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            user_pokemon_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            ability_id: {
                // Ability ID from the external API
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            effectiveness: {
                type: DataTypes.FLOAT,
                defaultValue: 1.0,
            },
        },
        {
            tableName: 'UserPokemonAbilities',
            timestamps: false,
        }
    );

    return UserPokemonAbility;
};
