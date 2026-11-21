const express = require('express');

const { allOrders, placeOrder, placeOrderRazorpay, verifyRazorpay, placeOrderStripe, verifyStripe, updateStatus, userOrders } = require('../controllers/orderController');
const { adminAuth } = require('../middlewares/adminAuth');
const  authUser  = require('../middlewares/authUser');

const orderRouter = express.Router();

orderRouter.post('/list-all', adminAuth, allOrders);
orderRouter.post('/status', adminAuth, updateStatus);

orderRouter.post('/place-order',authUser, placeOrder);
orderRouter.post('/stripe', authUser, placeOrderStripe);
orderRouter.post('/verify-stripe', authUser, verifyStripe);
orderRouter.post('/razorpay', authUser, placeOrderRazorpay);
orderRouter.post('/verify-razorpay', authUser, verifyRazorpay);

orderRouter.post('/user-orders', authUser, userOrders);

module.exports = orderRouter;
