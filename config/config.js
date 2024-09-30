require("dotenv").config();

const config = {
  env: process.env.NODE_ENV || "development",
  host: process.env.APP_HOST || "localhost",
  port: process.env.PORT || 3000,
};

module.exports = config;
