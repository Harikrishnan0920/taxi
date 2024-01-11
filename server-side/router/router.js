const express=require("express")
const user=require("../model/user")
const Router=express.Router()
const bcrypt=require('bcryptjs')
const generatedtoken=require("../token generation/token")
const verified=require("../middleware/middle")
const axios = require('axios');
const BookingInfo = require("../model/booking")



Router.get('/test',(req,res)=>{
res.json({message:"api working successfully"})
})


Router.post('/user',async (req,res)=>{
let {email,password,role,Name,Vehicleno}=req.body


let matchEmail=await user.findOne({email})

console.log('dfd',matchEmail)

if(!matchEmail){

    let hashedpwd= await bcrypt.hash(password,10)
    let savedetails={email,password:hashedpwd,role:role,Name:Name}
    if(role=='driver'){
        savedetails.Vehicleno=Vehicleno
    }
    let usersave=new user(savedetails)
   
    await usersave.save()
    let userRecord = await user.findOne({email})
    let token= await generatedtoken(userRecord.id)


   return res.json({message:"signed up successfully",statusCode:200,token:token,userid:userRecord.id})




}
return res.json({message:"User already exists",statusCode:400})


})


Router.post("/authenticate",async (req,res)=>{
const {email,password,role}=req.body

let userRecord=await user.findOne({email})

console.log('dfnd',userRecord)

if(!userRecord){
return res.json({message:"user is not registered yet"})
}
let isMatched= await bcrypt.compare(password,userRecord.password)
if(isMatched){
if(userRecord.role!==role){
  return res.json({statusCode:401,message:`This User account cannot log in as a ${role}`})
}

let token= await generatedtoken(userRecord.id)
console.log(token)
return res.json({message:'log in successful',statusCode:200,token:token,userid:userRecord.id})

    
}
res.json({message:"Incorrect password",statusCode:402})

})



Router.post('/book', async (req, res) => {
    try {
      const { userId, orgin, destination, pickupTime } = req.body;
  
      const bookingInfo = new BookingInfo({
        userId,
        orgin,
        destination,
        pickupTime,
      });
  
      await bookingInfo.save();
  
      res.status(201).json({ message: 'Now let us wait till we get a ride' ,statusCode:200});
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });






Router.get('/bookedorgins', async (req, res) => {
    try {
      const uniqueOrigins = await BookingInfo.distinct('orgin');
      res.json({message:"successfully fetched",statusCode:200,data:uniqueOrigins});
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  


  Router.get('/usersByOrigin/:origin', async (req, res) => {
    try {
      const { origin } = req.params;
  
      // Find bookings with the specified origin
      const bookings = await BookingInfo.find({ origin });
  
      // Extract user IDs from the bookings
      const userIds = bookings.map((booking) => booking.userId);
  
      // Find users with the extracted IDs
      const users = await user.find({ _id: { $in: userIds } });
  
      res.json({data:users,message:"successfully fetched",statusCode:200});
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });




module.exports=Router;