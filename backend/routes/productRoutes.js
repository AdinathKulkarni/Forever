const express = require('express');
const { addProduct, getAllProducts, getSingleProduct, removeProduct } = require('../controllers/productController');
const { upload } = require('../middlewares/multer');
const { adminAuth } = require('../middlewares/adminAuth');
const productRouter = express.Router();

productRouter.post('/add-product', adminAuth, upload.fields([
    {
        name: 'image1', maxCount:1,
    },
    {
        name: 'image2', maxCount:1,
    },
    {
        name: 'image3', maxCount:1,
    },
    {
        name: 'image4', maxCount:1,
    }, ]), addProduct);
productRouter.delete('/remove',adminAuth, removeProduct);
productRouter.get('/get-all', getAllProducts);
productRouter.get('/get-single', getSingleProduct);

module.exports = productRouter;