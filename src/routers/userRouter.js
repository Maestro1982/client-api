const express = require('express');
const router = express.Router();
const { insertUser } = require('../model/user/UserModel');
const { hashedPassword } = require('../helpers/bcryptHelper');

router.all('/', (req, res, next) => {
  //res.json({ message: 'Return from user router' });
  next();
});

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
module.exports = router;
