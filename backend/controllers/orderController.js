const Order = require('../models/orderModel');
const User = require('../models/user');
const Product = require('../models/product');
const mongoose = require('mongoose');
const Stripe = require('stripe');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET,
});

exports.placeOrder = async(req, res) => {
    try{
        const {items, address} = req.body;

        const requiredAddressFields = ['firstName', 'lastName', 'email', 'street', 'city', 'state', 'zipCode', 'country', 'phone'];
        if(!Array.isArray(items) || items.length === 0 || !address || typeof address !== 'object' ||
            requiredAddressFields.some((field) => typeof address[field] !== 'string' || !address[field].trim())){
            return res.status(400).json({
                success: false,
                message: "Order items and delivery address are required",
            });
        }

        if(items.some((item) => !item || typeof item !== 'object' || Array.isArray(item))){
            return res.status(400).json({
                success: false,
                message: "Order contains invalid items",
            });
        }

        const requestedItems = items.map(({productId, size, quantity}) => ({productId, size, quantity}));
        if(requestedItems.some((item) =>
            typeof item.productId !== 'string' ||
            !mongoose.isValidObjectId(item.productId) ||
            typeof item.size !== 'string' ||
            !Number.isInteger(item.quantity) ||
            item.quantity < 1
        )){
            return res.status(400).json({
                success: false,
                message: "Order contains invalid items",
            });
        }

        const productIds = [...new Set(requestedItems.map((item) => item.productId))];
        const products = await Product.find({_id: {$in: productIds}});
        const productsById = new Map(products.map((product) => [product._id.toString(), product]));

        const orderItems = [];
        for(const item of requestedItems){
            const product = productsById.get(item.productId);
            if(!product || !product.sizes.includes(item.size)){
                return res.status(400).json({
                    success: false,
                    message: "A product or selected size is no longer available",
                });
            }

            orderItems.push({
                productId: product._id.toString(),
                name: product.name,
                image: product.image[0],
                price: product.price,
                size: item.size,
                quantity: item.quantity,
            });
        }

        const subtotal = orderItems.reduce((total, item) => total + item.price * item.quantity, 0);
        const deliveryFee = 10;

        const newOrder = await Order.create({
            userId: req.userId,
            items: orderItems,
            address,
            amount: subtotal + deliveryFee,
            paymentMethod: "Cash on Delivery",
            paymentStatus: false,
            date: Date.now(),
        });

        await User.findByIdAndUpdate(req.userId, {cartData: {}});

        return res.status(201).json({
            success: true,
            message: "Order placed successfully",
            orderId: newOrder._id,
        });

    } catch(e){
        return res.status(500).json({
            success: false,
            message: "Order not placed, something went wrong !!",
            error: e.message,
        });
    }
}

exports.placeOrderRazorpay = async(req, res) => {
    let order;
    try {
        const { items, address } = req.body;
        const requiredAddressFields = ['firstName', 'lastName', 'email', 'street', 'city', 'state', 'zipCode', 'country', 'phone'];
        if (!Array.isArray(items) || items.length === 0 || !address || typeof address !== 'object' ||
            requiredAddressFields.some((field) => typeof address[field] !== 'string' || !address[field].trim())) {
            return res.status(400).json({ success: false, message: 'Order items and delivery address are required' });
        }

        const requestedItems = items.map(({ productId, size, quantity }) => ({ productId, size, quantity }));
        if (requestedItems.some((item) => typeof item.productId !== 'string' ||
            !mongoose.isValidObjectId(item.productId) || typeof item.size !== 'string' ||
            !Number.isInteger(item.quantity) || item.quantity < 1)) {
            return res.status(400).json({ success: false, message: 'Order contains invalid items' });
        }

        const productIds = [...new Set(requestedItems.map((item) => item.productId))];
        const products = await Product.find({ _id: { $in: productIds } });
        const productsById = new Map(products.map((product) => [product._id.toString(), product]));
        const orderItems = [];

        for (const item of requestedItems) {
            const product = productsById.get(item.productId);
            if (!product || !Array.isArray(product.sizes) || !product.sizes.includes(item.size) ||
                !Number.isFinite(product.price) || product.price <= 0) {
                return res.status(400).json({ success: false, message: 'A product or selected size is no longer available' });
            }
            orderItems.push({
                productId: product._id.toString(),
                name: product.name,
                image: product.image?.[0] || '',
                price: product.price,
                size: item.size,
                quantity: item.quantity,
            });
        }

        const totalAmount = orderItems.reduce((total, item) => total + item.price * item.quantity, 0) + 10;
        const amountInPaise = Math.round(totalAmount * 100);
        if (!Number.isSafeInteger(amountInPaise) || amountInPaise < 100) {
            return res.status(400).json({ success: false, message: 'Order total is below Razorpay’s minimum amount' });
        }

        order = await Order.create({
            userId: req.userId,
            items: orderItems,
            address,
            amount: totalAmount,
            paymentMethod: 'Razorpay',
            paymentStatus: false,
            status: 'Payment Pending',
            date: Date.now(),
        });

        const gatewayOrder = await razorpay.orders.create({
            amount: amountInPaise,
            currency: 'INR',
            receipt: order._id.toString(),
            notes: { orderId: order._id.toString(), userId: req.userId.toString() },
        });

        order.razorpayOrderId = gatewayOrder.id;
        await order.save();

        return res.status(201).json({
            success: true,
            key: process.env.RAZORPAY_KEY,
            orderId: gatewayOrder.id,
            amount: gatewayOrder.amount,
            currency: gatewayOrder.currency,
            name: 'Forever',
            description: `Order ${order._id}`,
            prefill: {
                name: `${address.firstName} ${address.lastName}`,
                email: address.email,
                contact: address.phone,
            },
        });
    } catch (error) {
        if (order) await Order.findByIdAndDelete(order._id).catch(() => {});
        console.error('Razorpay order creation failed:', error.message);
        return res.status(500).json({ success: false, message: 'Unable to start Razorpay checkout' });
    }
}

exports.verifyRazorpay = async(req, res) => {
    try {
        const { razorpay_order_id: razorpayOrderId, razorpay_payment_id: paymentId, razorpay_signature: signature } = req.body;
        if ([razorpayOrderId, paymentId, signature].some((value) => typeof value !== 'string' || !value)) {
            return res.status(400).json({ success: false, message: 'Razorpay payment details are incomplete' });
        }

        const order = await Order.findOne({ userId: req.userId, razorpayOrderId });
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order for this Razorpay payment was not found' });
        }

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_SECRET)
            .update(`${order.razorpayOrderId}|${paymentId}`)
            .digest('hex');
        const expectedBuffer = Buffer.from(expectedSignature, 'hex');
        const receivedBuffer = Buffer.from(signature, 'hex');
        if (expectedBuffer.length !== receivedBuffer.length || !crypto.timingSafeEqual(expectedBuffer, receivedBuffer)) {
            return res.status(400).json({ success: false, message: 'Razorpay payment signature is invalid' });
        }

        const payment = await razorpay.payments.fetch(paymentId);
        if (payment.order_id !== order.razorpayOrderId || payment.amount !== Math.round(order.amount * 100) ||
            payment.currency !== 'INR' || payment.status !== 'captured') {
            return res.status(400).json({ success: false, message: 'Razorpay payment is not captured for this order' });
        }

        if (!order.paymentStatus) {
            order.paymentStatus = true;
            order.status = 'Order Placed';
            await order.save();
            await User.findByIdAndUpdate(req.userId, { cartData: {} });
        }

        return res.status(200).json({ success: true, message: 'Payment verified and order placed successfully', orderId: order._id });
    } catch (error) {
        console.error('Razorpay payment verification failed:', error.message);
        return res.status(500).json({ success: false, message: 'Unable to verify Razorpay payment' });
    }
}

exports.placeOrderStripe = async(req, res) => {
    let order;
    try {
        const { items, address } = req.body;
        const frontendOrigin = process.env.FRONTEND_URL || req.headers.origin || 'http://localhost:5173';
        let frontendUrl;

        try {
            frontendUrl = new URL(frontendOrigin);
        } catch {
            return res.status(400).json({ success: false, message: 'Invalid checkout return URL' });
        }
        if (!['http:', 'https:'].includes(frontendUrl.protocol)) {
            return res.status(400).json({ success: false, message: 'Invalid checkout return URL' });
        }

        const requiredAddressFields = ['firstName', 'lastName', 'email', 'street', 'city', 'state', 'zipCode', 'country', 'phone'];
        if (!Array.isArray(items) || items.length === 0 || !address || typeof address !== 'object' ||
            requiredAddressFields.some((field) => typeof address[field] !== 'string' || !address[field].trim())) {
            return res.status(400).json({ success: false, message: 'Order items and delivery address are required' });
        }

        const requestedItems = items.map(({ productId, size, quantity }) => ({ productId, size, quantity }));
        if (requestedItems.some((item) => typeof item.productId !== 'string' ||
            !mongoose.isValidObjectId(item.productId) || typeof item.size !== 'string' ||
            !Number.isInteger(item.quantity) || item.quantity < 1)) {
            return res.status(400).json({ success: false, message: 'Order contains invalid items' });
        }

        const productIds = [...new Set(requestedItems.map((item) => item.productId))];
        const products = await Product.find({ _id: { $in: productIds } });
        const productsById = new Map(products.map((product) => [product._id.toString(), product]));
        const orderItems = [];

        for (const item of requestedItems) {
            const product = productsById.get(item.productId);
            if (!product || !Array.isArray(product.sizes) || !product.sizes.includes(item.size) ||
                !Number.isFinite(product.price) || product.price <= 0) {
                return res.status(400).json({ success: false, message: 'A product or selected size is no longer available' });
            }
            orderItems.push({
                productId: product._id.toString(),
                name: product.name,
                image: product.image?.[0] || '',
                price: product.price,
                size: item.size,
                quantity: item.quantity,
            });
        }

        const deliveryFee = 10;
        const subtotal = orderItems.reduce((total, item) => total + item.price * item.quantity, 0);
        const totalAmount = subtotal + deliveryFee;
        if (!Number.isFinite(totalAmount) || totalAmount <= 0) {
            return res.status(400).json({ success: false, message: 'Unable to calculate order total' });
        }

        order = await Order.create({
            userId: req.userId,
            items: orderItems,
            address,
            amount: totalAmount,
            paymentMethod: 'Stripe',
            paymentStatus: false,
            status: 'Payment Pending',
            date: Date.now(),
        });

        const lineItems = orderItems.map((item) => ({
            quantity: item.quantity,
            price_data: {
                currency: 'inr',
                unit_amount: Math.round(item.price * 100),
                product_data: { name: item.name, description: `Size: ${item.size}` },
            },
        }));
        lineItems.push({
            quantity: 1,
            price_data: {
                currency: 'inr',
                unit_amount: Math.round(deliveryFee * 100),
                product_data: { name: 'Delivery fee' },
            },
        });

        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            line_items: lineItems,
            customer_email: address.email,
            client_reference_id: order._id.toString(),
            metadata: { orderId: order._id.toString(), userId: req.userId.toString() },
            success_url: new URL('/verify?session_id={CHECKOUT_SESSION_ID}', frontendUrl).toString(),
            cancel_url: new URL('/place-order?payment=cancelled', frontendUrl).toString(),
        });

        order.stripeSessionId = session.id;
        await order.save();

        return res.status(201).json({ success: true, session_url: session.url, sessionId: session.id });
    } catch (error) {
        if (order) await Order.findByIdAndDelete(order._id).catch(() => {});
        console.error('Stripe checkout creation failed:', error.message);
        return res.status(500).json({ success: false, message: 'Unable to start Stripe checkout' });
    }
}

exports.verifyStripe = async(req, res) => {
    try {
        const { sessionId } = req.body;
        if (typeof sessionId !== 'string' || !sessionId) {
            return res.status(400).json({ success: false, message: 'Stripe checkout session is required' });
        }

        const session = await stripe.checkout.sessions.retrieve(sessionId);
        if (!session || session.metadata?.userId !== req.userId.toString()) {
            return res.status(403).json({ success: false, message: 'This checkout session does not belong to your account' });
        }

        const order = await Order.findOne({
            _id: session.metadata.orderId,
            userId: req.userId,
            stripeSessionId: session.id,
        });
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order for this checkout session was not found' });
        }
        if (session.currency !== 'inr' || session.amount_total !== Math.round(order.amount * 100)) {
            return res.status(400).json({ success: false, message: 'Checkout amount does not match the order' });
        }
        if (session.payment_status !== 'paid') {
            return res.status(400).json({ success: false, message: 'Payment has not been completed' });
        }

        if (!order.paymentStatus) {
            order.paymentStatus = true;
            order.status = 'Order Placed';
            await order.save();
            await User.findByIdAndUpdate(req.userId, { cartData: {} });
        }

        return res.status(200).json({ success: true, message: 'Payment verified and order placed successfully', orderId: order._id });
    } catch (error) {
        console.error('Stripe payment verification failed:', error.message);
        return res.status(500).json({ success: false, message: 'Unable to verify Stripe payment' });
    }
}

exports.allOrders = async(req, res) => {
    try{

        const orders = await Order.find({});
        res.status(200).json({
            success: true,
            message: 'Order fetching successfull',
            orders,
        })

    } catch(e) {
        return res.status(500).json({
            success: false,
            message: "Error while fetching all the orders",
        })
    }
}

exports.userOrders = async(req, res) => {
    try{
        const orders = await Order.find({userId: req.userId}).sort({date: -1});
        return res.status(200).json({
            success: true,
            orders,
        });
    } catch(e) {
        return res.status(500).json({
            success: false,
            message: "Unable to fetch your orders",
            error: e.message,
        });
    }
}

exports.updateStatus = async(req, res) => {
    try{
        const {orderId, status} = req.body
        await Order.findByIdAndUpdate(orderId, {status})
        res.json({success: true, message: "Order Status Updated"})
    } catch (error){
        console.log(error)
        res.json({success:false, message:error.message})
    }
}
