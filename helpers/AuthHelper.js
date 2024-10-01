const jwt = require("jsonwebtoken");
const config = require("../config/config");
const { User } = require("../database/models");
const HashHelper = require("./HashHelper");
const createHttpError = require("http-errors");

class AuthHelper {
  static async login({ email, password }) {
    const user = await User.findOne({ where: { email } });

    // user exists
    if (!user) {
      throw createHttpError(401, "Unauthorized", {
        message: "Invalid credentials",
      });
    }

    // password matched
    if (!HashHelper.compare(password, user.password)) {
      throw createHttpError(401, "Unauthorized", {
        message: "Invalid credentials",
      });
    }

    return user;
  }

  static async generateAccessToken(user) {
    const payload = {
      id: user.id,
      email: user.email,
    };
    return jwt.sign(payload, config.jwtSecret);
  }
}

module.exports = AuthHelper;
