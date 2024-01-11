const jwt=require("jsonwebtoken")
let verify=(req)=>{
    console.log('222',req)
    
let auth=req.headers.authorization
auth=auth?.split(" ")[1]
if(!auth)return {message:"Empty Token"}
let verification = jwt.verify(auth,process.env.SECRET_KEY,(err,decode)=>{
if(err){
    return {message:"Invalid Token"}
}else{
    return true
}




})




}

module.exports=verify