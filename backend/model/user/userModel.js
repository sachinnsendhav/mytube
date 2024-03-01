const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        default: "",
    },
    lastName: {
        type: String,
        default: "",
    },
    email: {
        type: String,
        validate: {
            validator: (value) => {
                return validator.isEmail(value);
            },
            message: 'Invalid email address',
        },
        unique: true
    },
    phoneNumber: {
        type: Number,
        validate: {
            validator: (value) => {
                return validator.isNumeric(String(value)) && String(value).length === 10;
            },
            message: 'Invalid phone number',
        },
    },
    password: {
        type: String,
        required: true
    },
    playList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Playlist'
    }],
    channel:[{
        channelName:{
            type:"String"
        },
        channelId:{
            type:"String"
        }
    }],
    role: {
        type: String,
        required: true,
        enum: ['admin']
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;