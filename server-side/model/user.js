const mongoose=require("mongoose")

//user info model

const Users = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    Name:{type:String,required:true},
    role: { type: String, enum: ["customer", "driver"], default: "customer" },
    Vehicleno:{
      type:String,
  }
  });


  //pre-validation
  Users.pre('save', function (next) {
    if (this.role === 'driver' && !this.Vehicleno) {
      // If the role is 'driver' and Vehicleno is not provided, prevent saving
      next(new Error('Vehicleno is required for drivers'));
    } else {
      next(); 
    }
  });
  

const usermodel=mongoose.model("users",Users)
module.exports=usermodel;





