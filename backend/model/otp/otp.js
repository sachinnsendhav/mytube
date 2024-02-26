const mongoose = require('mongoose');
const otpSchema=new mongoose.Schema({
    email: {
        type: "String", 
        required: true,
        unique:true
    },
    otp: {
        type: Number,
        required: true,
        unique: true,
        validate: {
            validator: function(value) {
                return /^[0-9]{4}$/.test(value); 
            },
            message: 'OTP must be a 4-digit number'
        }
    },
    expiresAt: {
        type: Date,
        default: Date.now,
        index:{ expires: '5m'  }
    }
})
const otp=mongoose.model('otp',otpSchema)
module.exports = otp;
