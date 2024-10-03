const router = require("express").Router();

const UserController = require("../../controllers/UserController");
const AuthenticationMiddleware = require("../../middlewares/AuthenticationMiddleware");

router.get("/:username", UserController.show);
router.put("/:id", AuthenticationMiddleware.handle, UserController.update);
router.patch(
  "/:id/avatar",
  AuthenticationMiddleware.handle,
  UserController.patchAvatar
);

module.exports = router;
