const express = require('express');
const router = express.Router();
const { insertUser, getUserByEmail } = require('../model/user/UserModel');
const { hashedPassword, comparePassword } = require('../helpers/bcryptHelper');
const { createAccessJWT, createRefreshJWT } = require('../helpers/jwtHelper');

router.all('/', (req, res, next) => {
  next();
});

// Create new user router
router.post('/', async (req, res) => {
  const { name, company, address, phone, email, password } = req.body;
  try {
    // Hash Password
    const hashedPass = await hashedPassword(password);

    const newUserObj = {
      name,
      company,
      address,
      phone,
      email,
      password: hashedPass,
    };
    const result = await insertUser(newUserObj);
    console.log(result);

    res.json({ message: 'New user is created', result });
  } catch (error) {
    console.log(error);
    res.json({ status: 'error', message: error.message });
  }
});

// User sign-in router
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ status: 'Error', message: 'Invalid Credentials!' });
  }

  // Get user with email from db
  const user = await getUserByEmail(email);

  const dbPassword = user && user._id ? user.password : null;

  if (!dbPassword) {
    return res.json({ status: 'Error', message: 'Invalid Email Or Password!' });
  }

  const result = await comparePassword(password, dbPassword);

  if (!result) {
    return res.json({ status: 'Error', message: 'Invalid Credentials!' });
  }

  const accessJWT = await createAccessJWT(user.email);
  const refreshJWT = await createRefreshJWT(user.email);

  res.json({
    status: 'Success',
    message: 'Login Successfully!',
    accessJWT,
    refreshJWT,
  });
});
module.exports = router;
