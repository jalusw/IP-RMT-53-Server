const jwt = require("jsonwebtoken");
const config = require("../config/config");
const { User } = require("../database/models");
const HashHelper = require("./HashHelper");
const { OAuth2Client } = require("google-auth-library");
const createHttpError = require("http-errors");
const google = require("googleapis").google;

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
    client.setCredentials({
      access_token: credentials.access_token,
    });

    const userInfo = await google
      .oauth2({
        auth: client,
        version: "v2",
      })
      .userinfo.get();

    const findUserWithUsername = await User.count({
      where: { username: userInfo.data.name },
    });

    let [user, created] = await User.findOrCreate({
      where: { email: userInfo.data.email },
      defaults: {
        email: userInfo.data.email,
        username: findUserWithUsername
          ? userInfo.data.name + Math.floor(Math.random() * 100)
          : userInfo.data.name,
        avatar: userInfo.data.picture,
        password: HashHelper.bcrypt(userInfo.data.id),
      },
    });

    return [user || created, client];
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
