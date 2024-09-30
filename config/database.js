require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DEV_DB_USER || "postgres",
    password: process.env.DEV_DB_PASSWORD || "postgres",
    database: process.env.DEV_DB_NAME || "db",
    host: process.env.DEV_DB_HOST || "localhost",
    dialect: process.env.DEV_DB_DIALECT || "postgres",
  },
  test: {
    username: process.env.CI_DB_USERNAME,
    password: process.env.CI_DB_PASSWORD,
    database: process.env.CI_DB_NAME,
    host: process.env.CI_DB_HOSTNAME,
    database: process.env.CI_DB_NAME,
    dialect: process.env.DEV_DB_DIALECT || "postgres",
  },
  production: {
    username: process.env.PROD_DB_USERNAME,
    password: process.env.PROD_DB_PASSWORD,
    database: process.env.PROD_DB_NAME,
    host: process.env.PROD_DB_HOSTNAME,
    port: process.env.PROD_DB_PORT,
    dialect: process.env.DEV_DB_DIALECT || "postgres",
  },
};
