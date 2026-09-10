const User = require("../models/user");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Register User
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({ success: false, message: 'Missing Details' });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.json({ success: false, message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationExpire = Date.now() + 1000 * 60 * 60;

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      emailVerificationToken: verificationToken,
      emailVerificationExpire: verificationExpire,
      isVerified: false
    });

    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.verify();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify Your Email",
      html: `
        <h2>Email Verification</h2>
        <p>Klik link berikut untuk verifikasi akun:</p>
        <a href="${verifyUrl}">${verifyUrl}</a>
      `
    });

    return res.json({
      success: true,
      message: "Registrasi berhasil. Silahkan cek email untuk verifikasi"
    });

  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Verify Email
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.json({
        success: false,
        message: "Invalid or expired token"
      });
    }

    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpire = undefined;

    await user.save();

    return res.json({
      success: true,
      message: "Email verified successfully"
    });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Forgot Password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.json({ success: false, message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 1000 * 60 * 15;

    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Password",
      html: `
        <h2>Password Reset</h2>
        <p>Klik link berikut untuk reset password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>Link hanya berlaku 15 menit.</p>
      `
    });

    return res.json({
      success: true,
      message: "Reset password link sent to email"
    });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.json({ success: false, message: "Password is required" });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.json({
        success: false,
        message: "Invalid or expired token"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return res.json({
      success: true,
      message: "Password reset successful"
    });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Login
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({ success: false, message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ success: false, message: 'Invalid email or password' });
    }

    if (!user.isVerified) {
      return res.json({
        success: false,
        message: "Please verify your email first"
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT, { expiresIn: '7d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      user: { email: user.email, name: user.name }
    });

  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Check Auth
const isAuth = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.json({ success: false, message: "User not authenticated" });
    }

    const user = await User.findById(userId).select("-password");
    return res.json({ success: true, user });

  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Logout
const logout = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    });

    return res.json({ success: true, message: "Logged Out" });

  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

module.exports = {
  register,
  verifyEmail,
  forgotPassword,
  resetPassword,
  userLogin,
  isAuth,
  logout,
};