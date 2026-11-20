const User = require('../models/user');

exports.addToCart = async(req, res) => {
    try{
        const { itemId, size } = req.body;
        const userId = req.userId;
        if (!userId || !itemId || !size) {
            return res.status(400).json({
                success: false,
                message: "Item and size are required",
            });
        }

        const userData = await User.findById(userId);
        if (!userData) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const userCartData = userData.cartData || {};

        if(userCartData[itemId]){
            if(userCartData[itemId][size]){
                userCartData[itemId][size] += 1;
            }
            else{
                userCartData[itemId][size] = 1;
            }
        }
        else{
            userCartData[itemId] = {};
            userCartData[itemId][size] = 1;
        }

        userData.cartData = userCartData;
        userData.markModified('cartData');
        await userData.save();

        return res.status(200).json({
            success: true,
            message: "Item added to cart",
        })
    } catch(e){
        return res.status(500).json({
            success: false,
            message: "Error while adding item to cart",
        });
    }
}

exports.updateCart = async(req, res) => {
    try{
        const {itemId, size, quantity } = req.body;
        const userId = req.userId;
        if (!userId || !itemId || !size || !Number.isInteger(quantity) || quantity < 0) {
            return res.status(400).json({
                success: false,
                message: "Item, size, and a valid quantity are required",
            });
        }

        const userData = await User.findById(userId);
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const userCartData = userData.cartData || {};
        if (!userCartData[itemId] || !(size in userCartData[itemId])) {
            return res.status(404).json({ success: false, message: "Cart item not found" });
        }

        if (quantity === 0) {
            delete userCartData[itemId][size];
            if (Object.keys(userCartData[itemId]).length === 0) {
                delete userCartData[itemId];
            }
        } else {
            userCartData[itemId][size] = quantity;
        }

        userData.cartData = userCartData;
        userData.markModified('cartData');
        await userData.save();

        return res.status(200).json({
            success: true,
            message: "Cart quantity updated successfully",
        });

    } catch(e){
        return res.status(500).json({
            success: false,
            message: "Error while updating your cart",
        });
    }
}

exports.getUserCart = async(req, res) => {
    try{
        const userData = await User.findById(req.userId);
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const userCartData = userData.cartData || {};

        return res.status(200).json({
            success: true,
            message: "User cart data fetched successfully !!",
            userCartData,
        })

    } catch(e){
        return res.status(500).json({
            success: false,
            message: "Error while fetching your cart items",
        });
    }
}
