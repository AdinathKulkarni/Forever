const jwt = require('jsonwebtoken');

const authUser = async(req, res, next) => {

    const { token } = req.headers;

    if(!token){
        return res.status(400).json({
            success: false,
            message: "You are not logged in, please login again !!"
        });
    }

    try{
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = token_decode.id;
        req.body = req.body || {};
        req.body.userId = token_decode.id;

        next();
    } catch (e){
        return res.status(500).json({
            success: false,
            message: "You are not authenticated",
            error: e.message,
        });
    }
}

module.exports = authUser;
