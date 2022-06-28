const bcrypt = require('bcrypt');
const saltRounds = 10;

const hashedPassword = (plainPasswordText) => {
  return new Promise((resolve) => {
    resolve(bcrypt.hashSync(plainPasswordText, saltRounds));
  });
};

const comparePassword = (plainPasswordText, passwordFromDb) => {
  return new Promise((resolve, reject) => {
    // Load hash from your password DB.
    bcrypt.compare(plainPasswordText, passwordFromDb, function (err, result) {
      if (err) reject(err);

      resolve(result);
    });
  });
};
module.exports = {
  hashedPassword,
  comparePassword,
};
