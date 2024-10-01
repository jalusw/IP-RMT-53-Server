const NoteController = require("../../controllers/NoteController");

const router = require("express").Router();

router.get("/", NoteController.index);
router.post("/", NoteController.create);
router.get("/:id", NoteController.show);
router.put("/:id", NoteController.update);
router.delete("/:id", NoteController.delete);

module.exports = router;
