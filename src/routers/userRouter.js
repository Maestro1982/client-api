const express = require('express');
const router = express.Router();
const { insertUser, getUserByEmail } = require('../model/user/UserModel');
const { hashedPassword, comparePassword } = require('../helpers/bcryptHelper');

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
  const result = await comparePassword(password, dbPassword);
  console.log(result);

  if (!dbPassword) {
    return res.json({ status: 'Error', message: 'Invalid Email Or Password!' });
  }

  res.json({ status: 'Success', message: 'Login Successfully!' });
});
module.exports = router;
