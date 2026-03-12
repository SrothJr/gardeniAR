const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/profile', userController.updateProfile);
router.post('/change-password', userController.changePassword);
router.post('/premium', userController.updatePremiumStatus);

module.exports = router;
