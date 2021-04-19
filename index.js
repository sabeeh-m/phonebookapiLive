// intializing Express module 
const express = require("express");
const app= express();

// requiring modules to be used
require("dotenv").config();
const moment= require("moment");
const mysql= require("mysql")
var cors = require('cors')
const ExpressError = require('./utils/ExpressError');
const logger = require('./utils/logger').logger;
const connection= require('./models/db');
const Query= require('./models/db_queries').default;


//initializing constants
const port= process.env.PORT || process.env.port



// intializing middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())


//Routes
app.get("/contacts",(req,res,next)=>{
  
 connection.query(Query.contacts,(err,data)=>{
     if(err){
         logger.error(`Url: ${req.url}, ${err} `)
        return  next(err)
     }else{
        res.status(200).json({numbers:data})

     }
 })   


})

app.post("/contacts",(req,res,next)=>{
console.log(req.body)    
let contact= Object.values(req.body);
connection.query(Query.createContact,[contact],(err,data)=>{
if(err){
    response={
        status:err.status,
        message:"err.message"
    }
    
logger.error(`Url: ${req.url} ${err}`)
console.log(err)
res.json(err)
}else{
    response={
        status:200,
        message:"user Added"

    }
   
    logger.info(`url:${req.url} status:${response.status} message:${response.message} `)
    res.status(response.status).json(response)
}

})


})



// Route middlewares
app.all('*', (req, res, next) => {
    next(new ExpressError('Route Not Found', 404))
})
app.use((err, req, res, next) => {
 
     const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    logger.error(`url:${req.url}, ${err} `)
    res.status(statusCode).json(err)
})

//starting server
app.listen(port,()=>{

    logger.info(`Server started at ${port} at ${moment().format()} `)
    console.log(`application started at ${port}`)
})