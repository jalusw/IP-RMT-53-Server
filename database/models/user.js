"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [4, 20],
            msg: "Username must be between 4 and 20 characters",
          },
          notEmpty: {
            args: true,
            msg: "Username cannot be empty",
          },
          notNull: {
            args: true,
            msg: "Username cannot be empty",
          },
        },
        unique: {
          args: true,
          msg: "Username already exists",
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: {
            args: true,
            msg: "Invalid email",
          },
          notEmpty: {
            args: true,
            msg: "Email cannot be empty",
          },
          notNull: {
            args: true,
            msg: "Email cannot be empty",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: "Password cannot be empty",
          },
          notNull: {
            args: true,
            msg: "Password cannot be empty",
          },
        },
      },
      avatar: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
