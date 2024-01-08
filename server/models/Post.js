const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const dateFormat = require('../utils/dateFormat');
const User = require("./User");

class Post extends Model {}

Post.init(
    {
      post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      postContent: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        get: function() {
          return dateFormat(this.getDataValue('createdAt'));
        }
      },
        createdBy: {
            type: DataTypes.INTEGER,
            references: {
                model: 'User',
                key: 'user_id',
            },
        },
    },
    {
      sequelize,
      timestamps: false,
      freezeTableName: true,
      underscored: true,
      modelNames: 'post',
    }
);

module.exports = Post;
