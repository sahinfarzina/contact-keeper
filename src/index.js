const path = require('path');
const fs = require('fs');
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('../config/connection');
const errorHandler = require('./middleware/error')
const cors = require('cors')


dotenv.config({path:'./config/config.env'})

//Connect to database
connectDB()


const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

const corsOptions = {
    origin: '*',
    methods:'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders:'Content-Type,X-Requested-With,Authorization,timeOffset',
    preflightContinue: true
}
app.use(cors(corsOptions))

app.use('/api',require('./routes/api.js'))

app.use(errorHandler)

if(process.env.NODE_ENV == 'production'){
    app.use(express.static('client/build'));
    app.get('*',(req,res)=>res.sendFile(path.resolve(__dirname,'client','build','index.html')))
}

const PORT = process.env.PORT || 3005

app.listen(PORT,()=>{
    console.log(`Server is running at ${PORT} port in ${process.env.NODE_ENV} mode`)
})

//handle unhandled promise rejection
process.on('unhandledRejection',(err,promise)=>{
    console.log(`Error: ${err.message}`)
    //Close server & exit process
    //app.close(()=>process.exit(1))
})