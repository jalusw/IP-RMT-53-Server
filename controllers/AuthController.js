const createHttpError = require("http-errors");
const HashHelper = require("../helpers/HashHelper");

const { User } = require("../database/models");

class AuthController {
  static async login(req, res) {
    res.send("Login");
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
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeCOnstraintError"
      ) {
        return next(
          createHttpError(400, "Bad Request", {
            errors: error.errors.map((err) => ({
              field: err.path,
              message: err.message,
            })),
          })
        );
      }
      return next(error);
    }
  }
}

module.exports = AuthController;
