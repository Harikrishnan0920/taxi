const mongoose=require("mongoose")
const express=require("express")
require("dotenv").config()
const routes=require("./router/router")



let app=express()


app.use(express.json())
app.use('/api',routes)
//mongo db connection
mongoose.connect(process.env.MDB_CONNECTION,{
useNewUrlParser:true,
useUnifiedTopology:true
})




const database = mongoose.connection

database.on("error",(err)=>console.log(err))


database.on("connected",()=>console.log('database connected successfully'))


app.listen(8000,()=>
{
console.log('listening to  8000')
})