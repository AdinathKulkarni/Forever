const mongoose = require('mongoose');

const emailVerificationOtpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    otpHash: {
        type: String,
        required: true,
    },
    attempts: {
        type: Number,
        default: 0,
    },
    expiresAt: {
        type: Date,
        required: true,
        expires: 0,
    },
}, { timestamps: true });

module.exports = mongoose.model('EmailVerificationOtp', emailVerificationOtpSchema);
