const express = require('express');
const { register, login } = require('../controllers/authController');
const { registerValidation, loginValidation } = require('../middleware/validators.js');
const authorizeRoles = require('../middleware/authorizeRoles');
const router = express.Router();

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);

router.get('/admin-dashboard', authorizeRoles('admin'), (req, res) => {
  res.json({ message: 'Welcome Admin!' });
});

router.get('/user-dashboard', authorizeRoles('user', 'admin'), (req, res) => {
  res.json({ message: 'Welcome User or Admin!' });
});

module.exports = router;
