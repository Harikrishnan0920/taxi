const mongoose=require("mongoose")



const Users = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    resetPassword: String,
    resetPasswordExpire: Date,
    role: { type: String, enum: ["customer", "driver"], default: "customer" },
  });

const usermodel=mongoose.model("users",Users)
module.exports=usermodel;