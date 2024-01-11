const mongoose=require("mongoose")



const Users = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    Name:{type:String,required:true},
    role: { type: String, enum: ["customer", "driver"], default: "customer" },
  });

const usermodel=mongoose.model("users",Users)
module.exports=usermodel;