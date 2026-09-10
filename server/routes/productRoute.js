const express = require('express');
const { upload } = require('../config/multer');
const authSeller = require('../middlewares/authSeller');

const {
  addProduct,
  changeStock,
  productById,
  productList,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

const productRouter = express.Router();

productRouter.post('/add', upload.array(['images']), authSeller, addProduct);
productRouter.get('/list', productList);
productRouter.get('/:id', productById);
productRouter.post('/stock', authSeller, changeStock);
productRouter.put('/update/:id', authSeller, updateProduct);
productRouter.delete('/delete/:id', authSeller, deleteProduct);

module.exports = productRouter;