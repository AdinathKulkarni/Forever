const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    items: {
        type: Array,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    address: {
        type: Object,
        required: true,
    },
    status: {
        type: String,
        required: true,
        default: 'Order Placed'
    },
    paymentMethod: {
        type: String,
        required: true,
    },
    paymentStatus: {
        type: Boolean,
        required: true,
    },
    stripeSessionId: {
        type: String,
    },
    razorpayOrderId: {
        type: String,
    },
    date: {
        type: Number,
        required: true,
    }
})

module.exports = mongoose.model("Order", orderSchema);
