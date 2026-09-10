const express = require('express');
const {
  isAuth,
  logout,
  register,
  userLogin,
  verifyEmail,
  forgotPassword,
  resetPassword
} = require('../controllers/userController');

const authUser = require('../middlewares/authUser');

const userRouter = express.Router();

userRouter.post('/register', register);
userRouter.get('/verify/:token', verifyEmail);

userRouter.post('/login', userLogin);
userRouter.get('/is-auth', authUser, isAuth);
userRouter.get('/logout', authUser, logout);
userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/reset-password/:token', resetPassword);

module.exports = userRouter;