"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Note extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, { foreignKey: "UserId" });
    }
  }
  Note.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: "Title cannot be empty",
          },
          notNull: {
            args: true,
            msg: "Title cannot be empty",
          },
        },
        unique: {
          args: true,
          msg: "Title already exists",
        },
      },
      slug: DataTypes.STRING,
      content: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: "Content cannot be empty",
          },
          notNull: {
            args: true,
            msg: "Content cannot be empty",
          },
        },
      },
      status: {
        type: DataTypes.ENUM("public", "private", "archived"),
      },
      UserId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Note",
      paranoid: true,
      hooks: {
        beforeCreate: (note) => {
          note.slug = note.title.toLowerCase().split(" ").join("-");
        },
      },
    }
  );
  return Note;
};
