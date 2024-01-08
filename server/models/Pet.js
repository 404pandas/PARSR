const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Pet extends Model {}

Pet.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 280],
            },
        },
        animal: {
           type: DataTypes.STRING,
           allowNull: false,
           validate: {
               isIn: [
                   ['DOG', 'CAT', 'BIRD', 'FERRET', 'FISH', 'FROG', 'GP', 'HAMSTER', 'HEDGEHOG', 'RABBIT', 'SNAKE', 'OTHER'],
               ],
           },
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        microchipRegistry: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        microchipNumber: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        petOwner: {
            type: DataTypes.INTEGER,
            references: {
                model: 'User',
                key: 'id',
            },
        },
        isMissing: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        geometry: {
            type: DataTypes.STRING,
        },
        image: {
            type: DataTypes.STRING,
        },
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'pet',
    }
);
module.exports = Pet;
