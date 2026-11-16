const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET);
}

exports.loginUser = async(req, res) => {
    try{

        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: "All fields are required !",
            });
        };

        if(!validator.isEmail(email)){
            return res.status(400).json({
                success: false,
                message: "Please enter valid email",
            })
        }

        const findUser = await User.findOne({email});
        if(!findUser){
            return res.status(404).json({
                success: false,
                message: "User not registered, Please signup",
            })
        }

        const isMatch = await bcrypt.compare(password, findUser.password);
        if(!isMatch){
            return res.status(400).json({
                success: false,
                message: "Invalid email or password",
            });
        };

        const token = createToken(findUser._id);
        return res.status(200).json({
            success: true,
            message: "Login successfull",
            token,
        })


    } catch(e){
        return res.status(500).json({
            success: false,
            message: "Error while logging in user",
            error: e.messgae,
        })
    }
}

exports.registerUser = async(req, res) => {
    try{

        const {name, email, password} = req.body;

        if(!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required !',
            });
        };

        const userAlreadyExists = await User.findOne({email});
        if(userAlreadyExists){
            return res.status(400).json({
                success: false,
                message: "You have already regiestered with this email, please login",
            });
        };


        if(!validator.isEmail(email)){
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email",
            });
        };


         if(password.length < 8){
            return res.status(400).json({
                success: false,
                message: "Please enter a strong password",
            });
         };

         //hash password
         const hashedPassword = await bcrypt.hash(password, 10);

        
         const newUser = await User.create({
            name, 
            email, 
            password: hashedPassword,
         })

         const token = createToken(newUser._id);

         return res.status(201).json({
            success: true,
            message: "User created successfully !",
            newUser,
            token,
         })

    } catch (error){
        return res.status(500).json({
            success: false,
            message: "Error while signing up the user",
            error: error.message,
        })
    }
}