const mongoose = require('mongoose');
const channelSchema=new mongoose.Schema({
    channelId: {
        type: String, 
        required: true
    },
    channelName:{
        type:String,
        required: true,
    },
    userId:{
        type : mongoose.Schema.Types.ObjectId,
        required : true
    }
})
const channel=mongoose.model('channel',channelSchema)
module.exports = channel;
