const { body } = require("express-validator");
const ValidationMiddleware = require("../middlewares/ValidationMiddleware");

module.exports = [
  body("username")
    .notEmpty()
    .withMessage("Username should not be empty")
    .trim(),
  body("email")
    .isEmail()
    .withMessage("Email is not valid")
    .notEmpty()
    .withMessage("Email should not be empty")
    .trim(),
  body("password").notEmpty().withMessage("Password should not be empty"),
  ValidationMiddleware.checkValidation,
];
