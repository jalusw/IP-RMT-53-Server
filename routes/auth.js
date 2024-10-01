const router = require("express").Router();

const AuthController = require("../controllers/AuthController");

router.post("/login", require("../requests/login"), AuthController.login);

router.post(
  "/register",
  require("../requests/register"),
  AuthController.register
);

module.exports = router;
