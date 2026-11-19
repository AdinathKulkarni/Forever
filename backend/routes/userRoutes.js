const express = require('express');
const { loginUser, registerUser, adminLogin, sendOTP, sendPasswordResetOTP, verifyPasswordResetOTP, resetPassword } = require('../controllers/userController');
const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/admin', adminLogin);
userRouter.post('/send-otp', sendOTP);
userRouter.post('/forgot-password/send-otp', sendPasswordResetOTP);
userRouter.post('/forgot-password/verify-otp', verifyPasswordResetOTP);
userRouter.post('/forgot-password/reset', resetPassword);

module.exports = userRouter;
