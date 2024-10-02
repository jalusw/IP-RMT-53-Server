const NoteController = require("../../controllers/NoteController");
const AuthenticationMiddleware = require("../../middlewares/AuthenticationMiddleware");

const router = require("express").Router();

router.use("/", AuthenticationMiddleware.handle);

router.get("/", NoteController.index);
router.post("/", NoteController.create);
router.get("/:id", NoteController.show);
router.put("/:id", NoteController.update);
router.delete("/:id", NoteController.delete);

module.exports = router;
