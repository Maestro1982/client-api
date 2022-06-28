const jwt = require('jsonwebtoken');
const { setJWT, getJWT } = require('./redisHelper');

const createAccessJWT = async (payload) => {
  try {
    const accessJWT = jwt.sign({ payload }, process.env.JWT_ACCESS_KEY, {
      expiresIn: '15m',
    });
    await setJWT(accessJWT);
    return Promise.resolve(accessJWT);
  } catch (error) {
    return Promise.reject(error);
  }
};

const createRefreshJWT = (payload) => {
  const refreshJWT = jwt.sign({ payload }, process.env.JWT_REFRESH_KEY, {
    expiresIn: '30d',
  });
  return Promise.resolve(refreshJWT);
};
module.exports = {
  createAccessJWT,
  createRefreshJWT,
};
