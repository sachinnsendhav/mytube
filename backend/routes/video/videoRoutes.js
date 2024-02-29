const express = require('express');
const videorouter = express.Router();
const videoController = require('../../controller/video/video');
const auth = require('../../middleware/auth');

videorouter.post('/video/uploadData',auth, videoController.video);
videorouter.get('/video/getData/:playListId',auth, videoController.getVideo);
videorouter.delete('/video/delete/:videoId', auth, videoController.deleteVideo)
module.exports = videorouter;