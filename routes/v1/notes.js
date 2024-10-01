const NoteController = require("../../controllers/NoteController");

const router = require("express").Router();

router.get("/", NoteController.index);

module.exports = router;
