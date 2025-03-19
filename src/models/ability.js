import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const Ability = sequelize.define(
        'Ability',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
        },
        {
            tableName: 'Abilities',
            timestamps: false,
        }
    );

    return Ability;
};
