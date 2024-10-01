const AuthenticationMiddleware = require("../../middlewares/AuthenticationMiddleware");

const router = require("express").Router();

router.use("/auth", require("./auth"));
router.use("/notes", AuthenticationMiddleware.handle, require("./notes"));

module.exports = router;
