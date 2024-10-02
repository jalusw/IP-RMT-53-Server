const { body } = require("express-validator");
const ValidationMiddleware = require("../middlewares/ValidationMiddleware");

module.exports = [
  body("title").notEmpty().withMessage("title should not be empty").trim(),
  ValidationMiddleware.handle,
];
