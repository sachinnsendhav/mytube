const Category = require('../../model/playlist/playlist');
const UserType=require('../../model/user/userModel')
const mongoose = require('mongoose')
 
 
exports.addPlaylist = async(req,res) => {
    try{
        const { name,description,role } = req.body;
        const userId = req.user.paylod._id;
        console.log("req123",req.user.paylod)
        const filterCategory=await Category.findOne({$and:[{name},{userId}]})
        console.log("filter",filterCategory)
        if (filterCategory) {
            return res.status(400).send({
                status: "FAILED",
                mesage: "Category with this name already exist",
              })
        }
        const category = new Category( {name,description,role,userId} );
        const categorySave=await category.save();
        console.log("cascascsa",categorySave)
        const responseData = {
            id : category._id,
            name: category.name,
            description: category.description,
        };
        const playlistData={
            name: categorySave.name,
            description: categorySave.description,
            userId: categorySave.userId,
            _id: categorySave._id,
            video: categorySave.video,
        }
        console.log("ww",playlistData)
        const userDetails=await UserType.findById({_id:userId})
         await UserType.updateOne({_id:userId},{ $push: { playList: playlistData } })
        res.status(200).send({ status:200,message:"Playlist Added Successfully", data:responseData });
    }
    catch(error){
        console.error("error",error)
        return res.status(400).send({ status:400, message:error.message, data:'' });
    }
}
 
exports.removePlaylist = async(req,res) => {
    try{
        const paylistId = req.params.paylistId;
        const userId = req.user.paylod._id;
        const paylistExist=await Category.findById({_id:paylistId})
        if (!paylistExist) {
            return res.status(404).send({
                status: "404",
                mesage: "Paylist with this id not found",
              })
        }
        await Category.deleteOne({_id:paylistId});
        await UserType.updateOne(
            { _id: new mongoose.Types.ObjectId(userId) },
            { $pull: { playList: {_id:new mongoose.Types.ObjectId(paylistId)} } },
            {new:true}
          )
        res.status(204).send({ status:204,message:"Playlist Delete Successfully", data:'' });
    }
    catch(error){
        return res.status(400).send({ status:400, message:error.message, data:'' });
    }
}
 
exports.getadminPlaylist=async(req,res)=>{
    try{
        const adminId = req.user.paylod._id;
        let playlistData=await Category.find({userId:adminId})
        const updatedData=playlistData.map((item)=>({
                "_id": item?._id,
                "name": item?.name,
                "description": item?.description,
                "userId": item?.userId,
                "videoCount":item?.video.length
        }))
        res.status(200).json({status:200,message:"",data:updatedData})
    }catch(error){
        console.error(err.message);
        res.status(500).send("Server error");
    }
    }