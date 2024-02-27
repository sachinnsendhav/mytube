const playlist = require("../../model/playlist/playlist");
const mongoose = require('mongoose')
const UserType= require("../../model/user/userModel")
module.exports = {
  video : async (req, res) => {
    try {
        const { videoName, videoDescription, videoUrl, playListId } = req.body;
        const playlist1 = await playlist.findById(playListId);
        if (!playlist1) {
            return res.status(404).json({ message: "Playlist not found" });
        }
        playlist1.video.push({
            videoName,
            videoDescription,
            videoUrl
        });
        await playlist1.save();
        // await UserType.updateMany({ playList: playListId }, { $set: { 'playList.$': playlist1 } });
        res.status(200).json({ message: "Video added to playlist successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
},
  getVideo: async (req, res, next) => {
    try {
      const playListId = req.params.playListId;
      const videos = await playlist.findById({ _id: playListId });
      res.status(200).send({ status: 200, message: "Success", data: videos });
    } catch (error) {
      console.log("err", error);
      return res.status(400).send({ status: 400, message: error.message });
    }
  },
  deleteVideo: async (req, res) => {
    try {
      const videoId = req.params.videoId;
      const paylistId = req.query.paylistId;
      const role = req.user.paylod.role;
      if (role == "user") {
        return res.status(401).send({ status: 401, message: "Not Authorized" });
      }
      const playlistExist = await playlist.findById({ _id: paylistId });
      if (!playlistExist) {
        return res
          .status(404)
          .send({ status: 404, message: "Playlist not found" });
      }
      const playlistVideoExist = await playlist.updateOne(
        { _id: paylistId },
        { $pull: { video: { _id: videoId } } }
      );
      if (playlistVideoExist.modifiedCount === 0) {
        return res
          .status(404)
          .send({ status: 404, message: "Video not found in playlist" });
      }
      await playlist.updateOne(
        { _id: paylistId },
        { $inc: { "video.$[].sNo": -1 } }
      );
      // const playlistData = await playlist.findById({ _id: paylistId });
      // await UserType.updateOne(
      //   { _id: new mongoose.Types.ObjectId(req.user.paylod._id) },
      //   { $push: { 'playList.$[playlist].video': playlistData.video } }, 
      //   { arrayFilters: [{ 'playlist.userId': new mongoose.Types.ObjectId(req.user.paylod._id) }] } 
      // )    
      console.log("ppp",playlist)
      res
        .status(204)
        .send({ status: 204, message: "Video Deleted Sucessfully", data: "" });
    } catch (error) {
      res.status(400).send({ status: 400, message: error.message, data: "" });
    }
  },
}