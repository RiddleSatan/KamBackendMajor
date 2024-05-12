import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import connect from './db/index.js';
import userModel from './models/user.model.js';
import productModel from './models/product.model.js';

connect();

const app =express()
const PORT=3000
const __dirname=path.resolve();

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname,'public')))


app.get('/data',(req,res)=>{
    res.send('this is the data')
})


app.listen(PORT,()=>{
    console.log(`server is running on PORT: ${PORT}`)
})