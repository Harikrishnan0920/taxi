let jwt=require("jsonwebtoken")

SECRET_KEY='ONETECH'
let generated_token=(userid)=>jwt.sign({id:userid},process.env.SECRET_KEY,{expiresIn:'2m'})

module.exports=generated_token