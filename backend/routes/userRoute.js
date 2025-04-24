import express from 'express';
import { loginUser, registerUser, adminLogin, forgotPassword, sendOtp, resetPassword } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/admin', adminLogin);
userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/send-otp', sendOtp);
userRouter.post('/reset-password', resetPassword);

export default userRouter;