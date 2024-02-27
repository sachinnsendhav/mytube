const playlist = require("../../model/playlist/playlist");
const mongoose = require('mongoose')
const UserType= require("../../model/user/userModel")
module.exports = {
  video: async (req, res) => {
    console.log(req.user.paylod, "auth req user");
    try {
      const role = req.user.paylod.role;
      if (role == "user") {
        return res.status(401).send({ status: 401, message: "Not Authorized" });
      }
      const { videoName, videoDescription, videoUrl, playListId } = req.body;
      const playListById = await playlist.findById({ _id: playListId });
      console.log("www",playListById)
      if (!playListById) {
        return res
          .status(404)
          .send({ status: 404, message: "PlayList with Id not found" });
      }
      // const payload = {  videoName, videoDescription, videoUrl, playListId, userId:req.user.paylod._id };
      playListById.video.push({
        videoName: videoName,
        videoDescription: videoDescription,
        videoUrl: videoUrl,
      });
      const videoData = await playListById.save();
      // const userData=await playlist.findByIdAndUpdate({_id:playListId},
      //     {
      //         $push:{
      //         video:{
      //             videoName: videoName,
      //             videoDescription: videoDescription,
      //             videoUrl: videoUrl,
      //         }
      //     }},{new:true})
      // { $push: { 'playList.$[playlist].video': { $each: videoData.video } } }
      // { $set: { 'playList.$[playlist].video': [videoData.video] } }, 
      console.log("uuu",videoData)
      // await UserType.updateOne(
      //   { _id: new mongoose.Types.ObjectId(req.user.paylod._id),'playList.playListId': new mongoose.Types.ObjectId(req.user.paylod._id) },
      //   { $push: { 'playList.$[playlist].video': { $each: videoData.video } } },
      //   { arrayFilters: [{ 'playlist.userId': new mongoose.Types.ObjectId(req.user.paylod._id) }] } 
      // )
    

      res
        .status(200)
        .send({
          status: 200,
          message: "Video details has been added successfully",
          data: videoData,
          check:array.playList
        });
    } catch (error) {
      console.log("err", error);
      return res.status(400).send({ status: 400, message: error.message });
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
      const playlistData = await playlist.findById({ _id: paylistId });
      await UserType.updateOne(
        { _id: new mongoose.Types.ObjectId(req.user.paylod._id) },
        { $push: { 'playList.$[playlist].video': playlistData.video } }, 
        { arrayFilters: [{ 'playlist.userId': new mongoose.Types.ObjectId(req.user.paylod._id) }] } 
      )    
      console.log("ppp",playlist)
      res
        .status(204)
        .send({ status: 204, message: "Video Deleted Sucessfully", data: "" });
    } catch (error) {
      res.status(400).send({ status: 400, message: error.message, data: "" });
    }
  },
}