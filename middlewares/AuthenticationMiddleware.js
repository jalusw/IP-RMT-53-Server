const createHttpError = require("http-errors");

class AuthenticationMiddleware {
  static handle(req, res, next) {
    if (!req.headers.authorization) {
      next(
        createHttpError(401, "Invalid token", {
          message: "access token is required",
        })
      );
    }

    next();
  }
}

module.exports = AuthenticationMiddleware;
