const cloudinary = require('cloudinary').v2;
exports.cloudinary = cloudinary;

exports.cloudinaryConnect = async(req, res) => {
    try{

        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_SECRET,
        })

        console.log("Cloudinary Connection successfull✅")

    } catch(e){
        console.log("Error connecting to cloudinary");
        return res.status(500).json({
            success: false,
            message: 'Error connecting to cloudinary',
            error: e.message,
        })
    }
}