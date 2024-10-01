const createHttpError = require("http-errors");
const { Note } = require("../database/models");
class NoteController {
  static async index(req, res, next) {
    try {
      const notes = await req.user.getNotes();
      return res.json({
        message: "success",
        data: {
          notes,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async show(req, res, next) {
    try {
      const note = await Note.findOne({
        where: {
          id: req.params.id,
        },
      });

      if (!note) {
        throw createHttpError(404, "Note not found");
      }

      if (note.UserId !== req.user.id) {
        throw createHttpError(403, "Forbidden");
      }

      return res.json({
        message: "success",
        data: {
          note,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const note = await req.user.createNote({
        title: req.body.title,
        content: req.body.content,
      });
      return res.status(201).json({
        message: "Note created",
        data: {
          note,
        },
      });
    } catch (error) {
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        return res.status(400).json({
          message: "Bad Request",
          errors: error.errors.map((err) => ({
            field: err.path,
            message: err.message,
          })),
        });
      }
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const note = await Note.findOne({
        where: {
          id: req.params.id,
        },
      });

      if (!note) {
        throw createHttpError(404, "Note not found");
      }

      if (note.UserId !== req.user.id) {
        throw createHttpError(403, "Forbidden");
      }

      await note.update(req.body);

      return res.json({
        message: "success",
        data: {
          note,
        },
      });
    } catch (error) {
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        return res.status(400).json({
          message: "Bad Request",
          errors: error.errors.map((err) => ({
            field: err.path,
            message: err.message,
          })),
        });
      }
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const note = await Note.findOne({
        where: {
          id: req.params.id,
        },
      });

      if (!note) {
        throw createHttpError(404, "Note not found");
      }

      if (note.UserId !== req.user.id) {
        throw createHttpError(403, "Forbidden");
      }

      await note.destroy();

      return res.json({
        message: "success",
        data: {
          note,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = NoteController;
