const express=require("express")
const user=require("../model/model")
const Router=express.Router()
const bcrypt=require('bcryptjs')
const generatedtoken=require("../token generation/token")
const verified=require("../middleware/middle")
const axios = require('axios');

Router.get('/test',(req,res)=>{
res.json({message:"api working successfully"})
})


Router.post('/user',async (req,res)=>{
let {email,password,role}=req.body


let matchEmail=await user.findOne({email})

console.log('dfd',matchEmail)

if(!matchEmail){

    let hashedpwd= await bcrypt.hash(password,10)
    let usersave=new user({email,password:hashedpwd,role:role})
    usersave.save()

   return res.json({message:"signed up successfully",statusCode:200})




}
return res.json({message:"User already exists"})


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
return res.json({message:'log in successful',statusCode:200,token:token})

    
}
res.json({message:"Incorrect password"})

})





Router.post("/explore",async (req,res)=>{
    if(await verified(req)==true){
    return res.json({statusCode:200,message:"you are authorized to explore"})



    }else{
        return {message:"jwt invalid"}
    }





})
module.exports=Router;