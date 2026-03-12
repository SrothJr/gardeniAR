// // backend/routes/userRoutes.js

// const express = require('express');
// const router = express.Router();
// const userController = require('../controllers/userController');

// router.post('/register', userController.registerUser);
// router.post('/login', userController.loginUser);
// router.post('/profile', userController.updateProfile);
// router.post('/change-password', userController.changePassword);
// router.post('/premium', userController.updatePremiumStatus);

// module.exports = router;


// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/profile', userController.updateProfile);
router.post('/change-password', userController.changePassword);
router.post('/premium', userController.updatePremiumStatus);

// Public profile (posts, comments, saved)
router.get('/profile/:userId', userController.getPublicProfile);

// Notifications
router.get('/notifications/:userId', userController.getNotifications);
router.post('/notifications/read', userController.markNotificationsRead);

module.exports = router;