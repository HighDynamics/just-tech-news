const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// create User model
class User extends Model {}

// define table columns and configuration
User.init(
  {
    // TABLE COLUMN DEFINITIONS GO HERE
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [4],
      },
    },
  },
  {
    // TABLE CONFIGURATION OPTIONS GO HERE

    // pass in imported sequelize connection
    sequelize,
    // don't automatically create timestamps
    timestamps: false,
    // don't pluralize name of database table
    freezeTableName: true,
    // use underscores instead of camelCase
    underscored: true,
    // model name remains lowercase in database
    modelName: 'user',
  }
);

module.exports = User;
