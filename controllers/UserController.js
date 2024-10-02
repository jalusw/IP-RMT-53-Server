const createHttpError = require("http-errors");
const { User } = require("../database/models");
class UserController {
  static async show(req, res, next) {
    try {
      const user = await User.findOne({
        where: {
          username: req.params.username,
        },
        attributes: [
          "id",
          "avatar",
          "username",
          "email",
          ["createdAt", "joined"],
        ],
      });
      if (!user) {
        throw createHttpError(404, "User not found");
      }

      return res.json({
        message: "success",
        data: {
          user,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) {
        throw createHttpError(404, "User not found");
      }

      await user.update(req.body);

      return res.json({
        message: "User updated",
        data: {
          user,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async patchAvatar(req, res, next) {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) {
        throw createHttpError(404, "User not found");
      }

      await user.update({
        avatar: req.body.avatar,
      });

      return res.json({
        message: "Avatar updated",
        data: {
          user,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
