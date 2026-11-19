const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const otpGenerator = require('otp-generator');
const mailSender = require('../utils/mailSender');
const EmailVerificationOtp = require('../models/emailVerificationOtp');
const {verificationOtp} = require('../utils/emailTemplate');

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

        const {name, email, password, otp} = req.body;

        if(!name || !email || !password || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, password, and verification code are required',
            });
        };

        if(typeof otp !== 'string' || !/^\d{6}$/.test(otp)){
            return res.status(400).json({
                success: false,
                message: 'Enter the 6-digit verification code',
            });
        }

        if(!validator.isEmail(email)){
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email",
            });
        };

        const userAlreadyExists = await User.findOne({email});
        if(userAlreadyExists){
            return res.status(400).json({
                success: false,
                message: "You have already registered with this email, please login",
            });
        };

         if(password.length < 8){
            return res.status(400).json({
                success: false,
                message: "Please enter a strong password",
            });
         };

         const otpRecord = await EmailVerificationOtp.findOne({email});
         if(!otpRecord){
            return res.status(400).json({
                success: false,
                message: "Request an email verification code before signing up",
            });
         }

         if(otpRecord.expiresAt.getTime() <= Date.now()){
            await EmailVerificationOtp.deleteOne({_id: otpRecord._id});
            return res.status(400).json({
                success: false,
                message: "Verification code expired. Request a new code",
            });
         }

         const otpMatches = await bcrypt.compare(otp, otpRecord.otpHash);
         if(!otpMatches){
            otpRecord.attempts += 1;
            if(otpRecord.attempts >= 5){
                await EmailVerificationOtp.deleteOne({_id: otpRecord._id});
                return res.status(400).json({
                    success: false,
                    message: "Too many incorrect attempts. Request a new verification code",
                });
            }

            await otpRecord.save();
            return res.status(400).json({
                success: false,
                message: `Incorrect verification code. ${5 - otpRecord.attempts} attempts remaining`,
            });
         }

         //hash password
         const hashedPassword = await bcrypt.hash(password, 10);

        
         const newUser = await User.create({
            name, 
            email, 
            password: hashedPassword,
         })

         await EmailVerificationOtp.deleteOne({_id: otpRecord._id});

         const token = createToken(newUser._id);

         return res.status(201).json({
            success: true,
            message: "User created successfully !",
            user: {
               id: newUser._id,
               name: newUser.name,
               email: newUser.email,
            },
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

exports.adminLogin = async(req, res) => {
    try{

        const {email, password} = req.body;

        if(!email || !password){
            return res.status(404).json({
                success: false,
                message: "All fields are required",
            });
        }

        if(email !== process.env.ADMIN_USER || password !== process.env.ADMIN_PWD){
            return res.status(400).json({
                success: false,
                message: "Incorrect Admin email or password",
            });
        }

        const token = jwt.sign(email+password, process.env.JWT_SECRET);
        return res.status(200).json({
            success: true,
            message: "Admin login successful",
            token,
        })

    } catch(e){
        return res.status(500).json({
            success: false,
            message: "Error occured while admin login",
            error: e.message,
        });
    }
}

exports.sendOTP = async(req, res) => {
    try{

        const {email} = req.body;

        if(!email || !validator.isEmail(email)){
            return res.status(400).json({
                success: false,
                message: "Please provide a valid email",
            });
        }

        //find user
        const userAlreadyExists = await User.findOne({email});

        if(userAlreadyExists){
            return res.status(400).json({
                success: false,
                message: "User already registered, please login",
            });
        }

        const otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });

        const otpHash = await bcrypt.hash(otp, 10);
        const otpRecord = await EmailVerificationOtp.findOneAndUpdate(
            {email},
            {
                otpHash,
                attempts: 0,
                expiresAt: new Date(Date.now() + 5 * 60 * 1000),
            },
            {upsert: true, new: true, setDefaultsOnInsert: true},
        );

        try {
            await mailSender(
                email,
                "Verify your email | Forever",
                verificationOtp(otp),
            );
        } catch(error) {
            await EmailVerificationOtp.deleteOne({_id: otpRecord._id, otpHash});
            throw error;
        }

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully",
        });

    } catch(e){
        return res.status(500).json({
            success: false,
            message: "Error while sending OTP",
            error: e.message,
        })
    }
}