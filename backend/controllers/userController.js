import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "2h" });
};

const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
  });
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const token = createToken(user._id);
    res.status(200).json({ success: true, token });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password, otp } = req.body;
    console.log('Register User Request:', { name, email, otp });

    // Check for existing registered user (must have name and password)
    const exists = await userModel.findOne({ email, name: { $exists: true }, password: { $exists: true } });
    console.log('Existing registered user:', exists);
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please provide a valid email" });
    }
    if (!password || password.length < 8) {
      return res.json({ success: false, message: "Password must be at least 8 characters" });
    }
    if (!otp) {
      return res.json({ success: false, message: "OTP is required" });
    }

    // Validate OTP against temporary record
    const tempUser = await userModel.findOne({ email, otp, otpExpires: { $gt: new Date() } });
    console.log('Temporary user for OTP:', tempUser);
    if (!tempUser) {
      return res.json({ success: false, message: "Invalid or expired OTP" });
    }

    // Clean up all temporary records for this email
    console.log('Cleaning up temporary records for email:', email);
    await userModel.deleteMany({ email, name: { $exists: false }, password: { $exists: false } });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword
    });
    const user = await newUser.save();
    console.log('New user saved:', user._id);

    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.error("Register Error:", error);
    res.json({ success: false, message: "Internal Server Error" });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "2h" });
      return res.status(200).json({ success: true, message: "Login successful", token });
    }
    return res.status(401).json({ success: false, message: "Invalid admin credentials" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 7200000; // 2 hour
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    const html = `
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>This link is valid for 1 hour.</p>
    `;

    await sendEmail(user.email, 'Password Reset Request', html);
    res.json({ success: true, message: "Password reset link sent to your email" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Internal Server Error" });
  }
};

const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.json({ success: false, message: "Email is required" });
    }

    // Check for existing registered user
    const user = await userModel.findOne({ email, name: { $exists: true }, password: { $exists: true } });
    if (user && req.path.includes('/register')) {
      return res.json({ success: false, message: "User already exists" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 300000; // 5 minutes

    if (user) {
      user.otp = otp;
      user.otpExpires = otpExpires;
      await user.save();
    } else {
      // Clean up any existing temporary records for this email
      await userModel.deleteMany({ email, name: { $exists: false }, password: { $exists: false } });
      const tempUser = new userModel({ email, otp, otpExpires });
      await tempUser.save({ validateBeforeSave: false });
    }

    const html = `<p>Your OTP for verification is: <strong>${otp}</strong>. It is valid for 5 minutes.</p>`;
    await sendEmail(email, 'Your OTP Code', html);
    res.json({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    console.error("Send OTP Error:", error);
    res.json({ success: false, message: "Internal Server Error" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, otp, newPassword } = req.body;
    const user = await userModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
      otp,
      otpExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.json({ success: false, message: "Invalid or expired token/OTP" });
    }

    if (!newPassword || newPassword.trim().length === 0) {
      return res.json({ success: false, message: "Password cannot be empty" });
    }
    if (newPassword.length < 8) {
      return res.json({ success: false, message: "Password must be at least 8 characters" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Internal Server Error" });
  }
};

export { loginUser, registerUser, adminLogin, forgotPassword, sendOtp, resetPassword };