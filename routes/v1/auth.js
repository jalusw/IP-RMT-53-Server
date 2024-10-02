const router = require("express").Router();

const AuthController = require("../../controllers/AuthController");
const AuthenticationMiddleware = require("../../middlewares/AuthenticationMiddleware");

router.post("/login", require("../../requests/login"), AuthController.login);

router.post(
  "/register",
  require("../../requests/register"),
  AuthController.register
);

router.use("/profile", AuthenticationMiddleware.handle);
router.get("/profile", AuthController.profile);
router.put("/profile", AuthController.update);

module.exports = router;
