const { cloudinary } = require('../config/cloudinary');
const Product = require('../models/product');

exports.addProduct = async(req, res) => {
    try{

        const {name, description, price, category, subCategory, size, bestseller} = req.body;

        if(!name || !description || !price || !category || !subCategory || !size || !bestseller){
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const image1 = req.files?.image1?.[0];
        const image2 = req.files?.image2?.[0];
        const image3 = req.files?.image3?.[0];
        const image4 = req.files?.image4?.[0];

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

        const imageUrl = await Promise.all(
            images.map(async (item) => {
                const result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                return result.secure_url;
            })
        );

        const productData = {
            name,
            description,
            price,
            category,
            subCategory,
            size: JSON.parse(size),
            bestSeller: bestseller === 'true' ? true : false,
            image: imageUrl,
            date: Date.now(),
        } 

        const product = await Product.create(productData);

        return res.status(200).json({
            success: true,
            message: "Product added successfully",
        })
    } catch(e){
        return res.status(500).json({
            success: false,
            message: "Unable to add product",
            error: e.message,
        })
    }
}

exports.getAllProducts = async(req, res) => {
    try{
        const products = await Product.find({});
        return res.status(200).json({
            success: true,
            products,
        })
    } catch(e){
        return res.status(500).json({
            success: false,
            message: "Error while fetching all products",
        })
    }
}

exports.getSingleProduct = async(req, res) => {
    try{
        const id = req.body.id;

        if(!id){
            return res.status(404).json({
                success: false,
                message: "Id not found",
            });
        }

        const findProduct = await Product.findById(id);

        if(!findProduct){
            return res.status(404).json({
                success: false,
                message: "Product with provided id not found",
                id: id,
            });
        } 

        return res.status(200).json({
            success: false,
            message: "Product found",
            findProduct,
        })

    } catch(e){
        return res.status(500).json({
            success: false,
            message: "Error while fetching the requested product",
        })
    }
};

exports.removeProduct = async(req, res) => {
    try{
        const {id} = req.body;

        if(!id){
            return res.status(400).json({
                success: false,
                message: "Product-Id must not be null",

            });
        }

        const deletedProduct = await Product.findByIdAndDelete(id);
        if(!deletedProduct){
            return res.status(404).json({
                success: false,
                message: "Product with provided Id not found",
                id: id,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product deleted",
        })

    } catch(e){
        return res.status(500).json({
            success: false,
            message: "Error while deleting the product",
            error: e.message,
        })
    }
}