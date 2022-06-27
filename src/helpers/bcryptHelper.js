const bcrypt = require('bcrypt');
const saltRounds = 10;

const hashedPassword = (plainPasswordText) => {
  return new Promise((resolve) => {
    resolve(bcrypt.hashSync(plainPasswordText, saltRounds));
  });
};
module.exports = {
  hashedPassword,
};
