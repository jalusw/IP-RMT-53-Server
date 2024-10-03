require("dotenv").config();

const config = {
  env: process.env.NODE_ENV || "development",
  host: process.env.APP_HOST || "localhost",
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || "secret",

  cloudinaryName: process.env.CLOUDINARY_NAME,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,

  googleAIStudioApiKey: process.env.GOOGLE_AI_STUDIO_API_KEY,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
};

module.exports = config;
