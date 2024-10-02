const createHttpError = require("http-errors");
const HashHelper = require("../helpers/HashHelper");

const { User } = require("../database/models");
const AuthHelper = require("../helpers/AuthHelper");
const CloudinaryService = require("../services/CloudinaryService");

class AuthController {
  static async login(req, res, next) {
    try {
      const user = await AuthHelper.login(req.body);
      const token = AuthHelper.generateAccessToken(user);

      return res.status(200).json({
        message: "Login success",
        data: {
          access_token: token,
          user: {
            username: user.username,
            email: user.email,
            avatar: user.avatar,
          },
        },
      });
    } catch (error) {
      return next(error);
    }
  }

  static async register(req, res, next) {
    try {
      const user = await User.create({
        avatar:
          req.body?.avatar ||
          `https://ui-avatars.com/api/?name=${req.body.username}`,
        username: req.body.username,
        email: req.body.email,
        password: HashHelper.bcrypt(req.body.password),
      });

      return res.status(201).json({
        message: "User created",
        data: {
          user: {
            username: user.username,
            email: user.email,
            avatar: user.avatar,
          },
        },
      });
    } catch (error) {
      if (
        error.name === "SequelizeUniqueConstraintError" ||
        error.name === "SequelizeValidationError"
      ) {
        error = createHttpError(400, "Bad Request", {
          errors: error.errors.map((err) => ({
            field: err.path,
            message: err.message,
          })),
        });
      }
      return next(error);
    }
  }

  static async profile(req, res, next) {
    try {
      return res.status(200).json({
        message: "User found",
        data: {
          user: {
            username: req.user.username,
            email: req.user.email,
            avatar: req.user.avatar,
            createdAt: req.user.createdAt,
            updatedAt: req.user.updatedAt,
          },
        },
      });
    } catch (error) {
      return next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const user = await User.findByPk(req.user.id);

      if (!user) {
        throw createHttpError(404, "User not found");
      }

      let avatar = null;

      if (req.file) {
        const upload = await CloudinaryService.uploadImage(req.file);
        avatar = upload.secure_url;
      }

      await user.update({
        username: req.body.username || user.username,
        avatar:
          avatar ||
          user.avatar ||
          (req.body.username != user.username &&
            `https://ui-avatars.com/api/?name=${req.body.username}`),
      });

      return res.status(200).json({
        message: "User updated",
        data: {
          user: {
            avatar: user.avatar,
            username: user.username,
            email: user.email,
          },
        },
      });
    } catch (error) {
      if (
        error.name === "SequelizeUniqueConstraintError" ||
        error.name === "SequelizeValidationError"
      ) {
        error = createHttpError(400, "Bad Request", {
          errors: error.errors.map((err) => ({
            field: err.path,
            message: err.message,
          })),
        });
      }
      return next(error);
    }
  }
}

module.exports = AuthController;
