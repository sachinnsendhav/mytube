const express = require('express');
const playlistrouter = express.Router();
const auth = require('../../middleware/auth');
const playlistcontroller = require('../../controller/playlist/playlist');
 
 
playlistrouter.post('/playlist/addPlaylist',auth, playlistcontroller.addPlaylist);
playlistrouter.delete('/playlist/removePlaylist/:paylistId',auth, playlistcontroller.removePlaylist)
playlistrouter.get('/playlist/getPlaylist',auth, playlistcontroller.getadminPlaylist)
 
module.exports = playlistrouter;
 