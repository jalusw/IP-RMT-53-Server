const AuthenticationMiddleware = require("../../middlewares/AuthenticationMiddleware");

const router = require("express").Router();

router.use("/auth", require("./auth"));
router.use("/notes", require("./notes"));
router.use("/users", require("./users"));

module.exports = router;
