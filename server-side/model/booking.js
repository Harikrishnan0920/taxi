const mongoose=require("mongoose")


const BookingInfoSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orgin: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    pickupTime: {
     type:String,
      required: true,
    },
    bookedby:{
      type:String,
    },
    cancelled:{
      type:String
    }
  
  });
  
  const BookingInfo = mongoose.model('BookingInfo', BookingInfoSchema);
  
  module.exports = BookingInfo;
  