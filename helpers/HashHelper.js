const bcrypt = require("bcrypt");

class HashHelper {
  static bcrypt(plaintext, saltRounds = 10) {
    return bcrypt.hashSync(plaintext, bcrypt.genSaltSync(saltRounds));
  }

  static compare(plaintext, hash, saltRounds = 10) {
    return bcrypt.compareSync(plaintext, hash, bcrypt.genSaltSync(saltRounds));
  }
}

module.exports = HashHelper;
