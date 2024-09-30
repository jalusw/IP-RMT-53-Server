require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DEV_DB_USER || "postgres",
    password: process.env.DEV_DB_PASSWORD || "postgres",
    database: process.env.DEV_DB_DATABASE || "db",
    host: process.env.DEV_DB_HOST || "localhost",
    dialect: process.env.DEV_DB_DIALECT || "postgres",
  },
  test: {
    username: process.env.CI_DB_USER || "postgres",
    password: process.env.CI_DB_PASSWORD || "postgres",
    database: process.env.CI_DB_DATABASE || "db_test",
    host: process.env.CI_DB_HOST || "localhost",
    dialect: process.env.CI_DB_DIALECT || "postgres",
    logging: false,
  },
};
