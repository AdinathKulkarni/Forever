const express = require('express');
const { addToCart, getUserCart, updateCart } = require('../controllers/cartController.js');
const authUser = require('../middlewares/authUser.js');

const cartRouter = express.Router();

cartRouter.get('/get', authUser , getUserCart);
cartRouter.post('/add-item',authUser, addToCart);
cartRouter.post('/update-item',authUser ,updateCart);

module.exports = cartRouter;
