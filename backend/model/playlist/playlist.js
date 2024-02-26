const mongoose = require('mongoose');

const playlistShema = new mongoose.Schema({
    name:{
        type : String,
        required : true
    },
    description:{
        type : String,
        required : true,
    },
    video:[{
        sNo:{type:Number},
        videoName: {
        type: String,
        required: true,
        },
        videoDescription: {
            type: String,
            required:true
        },
        videoUrl: {
            type: String,
            required:true
        }
    }],
    userId:{
        type : mongoose.Schema.Types.ObjectId,
        required : true
    }
})


// Add a pre-save hook to assign serial numbers to line items
playlistShema.pre("save", function (next) {
    let sNo = 1; // Initialize serial number
    // Iterate through each line item and assign a serial number
    console.log("eee",this)
    this.video.forEach((item) => {
      item.sNo = sNo;
      sNo++;
    });
    
    next(); // Continue with the save operation
  });
const Playlist = mongoose.model('Playlist',playlistShema);
module.exports = Playlist;