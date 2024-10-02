const jwt = require("jsonwebtoken");
const config = require("../config/config");
const { User } = require("../database/models");
const HashHelper = require("./HashHelper");
const { OAuth2Client } = require("google-auth-library");
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

  static async google(credentials) {
    const client = new OAuth2Client();

    const ticket = await client.verifyIdToken({
      idToken: credentials.credential,
      audience: config.googleClientId,
    });

    const payload = ticket.getPayload();

    const findUserWithUsername = await User.count({
      where: { username: payload.name },
    });

    let [user, created] = await User.findOrCreate({
      where: { email: payload.email },
      defaults: {
        email: payload.email,
        username: findUserWithUsername
          ? payload.name + Math.floor(Math.random() * 100)
          : payload.name,
        avatar: payload.picture,
        password: HashHelper.bcrypt(payload.sub),
      },
    });

    return user || created;
  }

  static generateAccessToken(user) {
    const payload = {
      id: user.id,
      email: user.email,
    };
    return jwt.sign(payload, config.jwtSecret);
  }

  static verifyAccessToken(token) {
    return jwt.verify(token, config.jwtSecret);
  }
}

module.exports = AuthHelper;
