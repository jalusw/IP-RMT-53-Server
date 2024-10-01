const fs = require("fs");
const path = require("path");

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const createError = require("http-errors");
const errorHandler = require("error-handler-json");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  morgan("combined", {
    stream: fs.createWriteStream(path.join(__dirname, "access.log"), {
      flags: "a",
    }),
  })
);

app.use("/v1", require("./routes/v1"));

app.use((req, res, next) => {
  throw createError(404, "Not Found");
});
app.use(errorHandler());

module.exports = app;
