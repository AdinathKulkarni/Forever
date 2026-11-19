const mongoose = require('mongoose');

const passwordResetOtpSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, trim: true },
    otpHash: { type: String, required: true },
    attempts: { type: Number, default: 0 },
    expiresAt: { type: Date, required: true, expires: 0 },
}, { timestamps: true });

module.exports = mongoose.model('PasswordResetOtp', passwordResetOtpSchema);
