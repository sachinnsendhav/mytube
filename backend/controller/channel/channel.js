const channel=require("../../model/channel/channel")
const userType=require("../../model/user/userModel")
const mongoose = require('mongoose')
const errorHandlerMiddleware = require("../../middleware/errorvalidation")
 
module.exports = {
    addChannel: async (req, res) => {
      console.log(req.user.paylod, "auth req user");
      try {
        const role = req.user.paylod.role;
       
        if (role == "user") {
          return res.status(401).send({ status: 401, message: "Not Authorized" });
        }
        console.log("reqqq",req.user.paylod)
        const userId=req.user.paylod._id
        const { channelName, channelId} = req.body;
        const channelExist=await channel.findOne({$and:[{channelId},{userId}]})
        console.log("www",channelExist)
        if(channelExist){
          return res.status(400).send({
            status: "FAILED",
            mesage: `Channel with this ${channelId} already exist`,
          })
        }
        const addChannel=new channel({channelName,channelId,userId})
        const channelSave=await addChannel.save()
        const channelData={
          channelName: channelSave.channelName,
          channelId: channelSave.channelId,
      }
      await userType.updateOne({_id:new mongoose.Types.ObjectId(userId)},{ $push: { channel: channelData } })
        res.status(201).send({status:"200",statusText:"OK",data:addChannel})
      } catch (error) {
        console.log("err", error);
        // return res.status(400).send({ status: 400, message: error.message });
        errorHandlerMiddleware(error,req,res)
      }
    },
    getChannel: async (req, res, next) => {
      try {
        const userId = req.user.paylod._id;
        const channels = await channel.find({ userId: userId });
        res.status(200).send({ status: 200, message: "Success", data: channels });
      } catch (error) {
        console.log("err", error);
        return res.status(400).send({ status: 400, message: error.message });
      }
    },
    deleteChannel: async (req, res) => {
      try {
      const channelId=req.params.channelId
      console.log("ccc",channelId)
      const channelExist=await channel.findById({_id:channelId})
      if(!channelExist){
        return res.status(404).send({
          status: "FAILED",
          mesage: `ChannelId Not found`,
        })
      }  
      const deltedata= await channel.deleteOne({_id:channelId});
      console.log("dd",deltedata)
      await userType.find({userId:req.user.paylod._id})
      await userType.updateMany(
        {_id:new mongoose.Types.ObjectId(req.user.paylod._id)},
        {$pull:{channel:{channelId:channelExist.channelId}}}
    )
    res.status(204).send({ status:204,message:"Channel Delete Successfully", data:'' });
      } catch (error) {
        // res.status(400).send({ status: 400, message: error.message, data: "" });
        errorHandlerMiddleware(error,req,res)
      }
    }
  };