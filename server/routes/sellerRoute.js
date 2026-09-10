const express = require('express');
const {
  isSellerAuth,
  sellerLogin,
  sellerLogout
} = require('../controllers/sellerController');

const authSeller = require('../middlewares/authSeller');

const sellerRouter = express.Router();

sellerRouter.post('/login', sellerLogin);
sellerRouter.get('/is-auth', authSeller, isSellerAuth);
sellerRouter.get('/logout', sellerLogout);

module.exports = sellerRouter;