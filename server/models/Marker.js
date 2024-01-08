const { Model,  DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

const Pet = require("./Pet");
class Marker extends Model {}

Marker.init(
    {
        marker_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        petID: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Pet',
                key: 'pet_id',
            },
        },
        markerName: {
            type: DataTypes.STRING,
        },
        markerDescription: {
            type: DataTypes.STRING,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        createdBy: {
            type: DataTypes.INTEGER,
            references: {
                model: 'User',
                key: 'user_id',
            },
        },
        coordinates: {
            type: DataTypes.ARRAY(DataTypes.FLOAT),
        },
        image: {
            type: DataTypes.STRING,
        },
        geometry: {
            type: DataTypes.STRING,
        },
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'marker',
    }
);
module.exports = Marker;
