const { validationResult } = require("express-validator");
const createHttpError = require("http-errors");

class ValidationMiddleware {
  static async handle(req, _res, next) {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    return next(
      createHttpError(400, "Bad Request", {
        errors: errors.array().map((err) => ({
          field: err.path,
          message: err.msg,
        })),
      })
    );
  }
}

module.exports = ValidationMiddleware;
