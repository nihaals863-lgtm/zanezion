const express = require('express');
const router = express.Router();
const { registerUser, registerStaff, getPendingStaff, reviewStaff, loginUser, getUserProfile, updateUserProfile, forgotPassword, resetPassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { uploadDocs } = require('../middleware/uploadMiddleware');

router.post('/register', registerUser);
router.post('/staff-register', uploadDocs, registerStaff);
router.get('/staff-pending', protect, getPendingStaff);
router.put('/staff-review/:id', protect, reviewStaff);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

module.exports = router;
