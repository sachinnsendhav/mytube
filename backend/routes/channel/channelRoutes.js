const express = require('express');
const auth = require('../../middleware/auth');
const channelrouter = express.Router();
const channelController = require('../../controller/channel/channel');
channelrouter.post('/channel/addChannel',auth,channelController.addChannel);
channelrouter.get('/channel/getChannels',auth,channelController.getChannel);
channelrouter.delete('/channel/deleteChannel/:channelId',auth,channelController.deleteChannel)
module.exports = channelrouter;