const { auth } = require("google-auth-library");
const GoogleGeminiService = require("../../services/GoogleGeminiService");
const AuthHelper = require("../../helpers/AuthHelper");
const google = require("googleapis").google;

const router = require("express").Router();

router.use("/auth", require("./auth"));
router.use("/notes", require("./notes"));

router.post("/assistant/enhance", async (req, res, next) => {
  try {
    const { content } = req.body;
    const result = await GoogleGeminiService.prompt([
      "Enhance the following text and generate more content,` output into markdown format only and don't provide any explanation:",
      content,
    ]);

    return res.json({
      message: "success",
      data: {
        result: result.response.text(),
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post("/assistant/summarize", async (req, res, next) => {
  try {
    const { content } = req.body;
    const result = await GoogleGeminiService.prompt([
      "Summarize following content and output into markdown format and don't provide any explanation:",
      content,
    ]);

    return res.json({
      message: "success",
      data: {
        result: result.response.text(),
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post("/services/drive", async (req, res, next) => {
  try {
    const { access_token, content, title } = req.body;

    const [, client] = await AuthHelper.google({
      access_token,
    });

    const drive = google.drive({ version: "v3", auth: client });

    const result = await drive.files.create({
      requestBody: {
        name: title,
        mimeType: "text/markdown",
      },
      media: {
        mimeType: "text/markdown",
        body: content,
      },
    });

    return res.json({
      message: "success",
      data: {
        id: result.data.id,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
