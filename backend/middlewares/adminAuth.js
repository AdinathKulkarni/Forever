const jwt = require('jsonwebtoken');

exports.adminAuth = async(req, res, next) => {
    try{

        const {token} = req.headers;

        if(!token){
            return res.status(404).json({
                success: false,
                message: "Token not found",
            });
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET);

        if(decode !== process.env.ADMIN_USER + process.env.ADMIN_PWD){
            return res.status(400).json({
                success: false,
                message: "Unable to authorize as Admin",
            });
        }

        next();

    } catch(e){
        return res.status(500).json({
            success: false,
            message: "Error while authorizing as Admin",
        })
    }
}