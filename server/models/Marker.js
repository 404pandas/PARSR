const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");
const User = require("./User");
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
    pet_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "pet",
        key: "pet_id",
      },
    },
    marker_name: {
      type: DataTypes.STRING,
    },
    marker_description: {
      type: DataTypes.STRING,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    created_by: {
      type: DataTypes.INTEGER,
      references: {
        model: "user",
        key: "user_id",
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
    modelName: "marker",
  }
);

module.exports = Marker;
