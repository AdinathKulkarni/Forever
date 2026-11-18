const { cloudinary } = require('../config/cloudinary');
const Product = require('../models/product');

exports.addProduct = async(req, res) => {
    try{

        const {name, description, price, category, subCategory, sizes, bestseller} = req.body;

        if(!name || !description || !price || !category || !subCategory || !sizes || bestseller === undefined){
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        let parsedSizes;
        try {
            parsedSizes = JSON.parse(sizes);
        } catch {
            return res.status(400).json({
                success: false,
                message: "Sizes must be a valid JSON array",
            });
        }

        if(!Array.isArray(parsedSizes) || parsedSizes.length === 0 || !parsedSizes.every((item) => typeof item === 'string')){
            return res.status(400).json({
                success: false,
                message: "Select at least one valid product size",
            });
        }

        const image1 = req.files?.image1?.[0];
        const image2 = req.files?.image2?.[0];
        const image3 = req.files?.image3?.[0];
        const image4 = req.files?.image4?.[0];

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

        if(images.length === 0){
            return res.status(400).json({
                success: false,
                message: "Upload at least one product image",
            });
        }

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
            sizes: parsedSizes,
            bestSeller: bestseller === 'true' || bestseller === true,
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