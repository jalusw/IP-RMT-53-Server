const createHttpError = require("http-errors");
const HashHelper = require("../helpers/HashHelper");

const { User } = require("../database/models");
const AuthHelper = require("../helpers/AuthHelper");

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
}

module.exports = AuthController;
