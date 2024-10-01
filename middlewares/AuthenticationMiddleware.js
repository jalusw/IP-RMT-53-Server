const createHttpError = require("http-errors");
const AuthHelper = require("../helpers/AuthHelper");
const { User } = require("../database/models");

class AuthenticationMiddleware {
  static async handle(req, res, next) {
    try {
      if (!req.headers.authorization) {
        throw createHttpError(401, "Invalid token", {
          message: "access token is required",
        });
      }

      const [, token] = req.headers.authorization.split(" ");

      const decoded = AuthHelper.verifyAccessToken(token);

      const user = await User.findByPk(decoded.id);

      if (!user) {
        throw createHttpError(401, "Unauthorized", {
          message: "Invalid token",
        });
      }

      req.user = user;

      next();
    } catch (error) {
      if (error.name == "JsonWebTokenError") {
        error = createHttpError(401, "Unauthorized", {
          message: "Invalid token",
        });
      }
      next(error);
    }
  }
}

module.exports = AuthenticationMiddleware;
