const express = require("express");
const mysql = require("mysql");
const dotenv =require("dotenv");
const path  =require("path");
const cookieParser =require("cookie-parser");
var nodemailer = require('nodemailer');


dotenv.config({path:'./.env'});

const app= express();

app.use(cookieParser());

const db=mysql.createConnection({
    host:process.env.DATABASE_HOST,
    user:process.env.DATABASE_USER,
    password:process.env.DATABASE_PASSWORD,
    database:process.env.DATABASE
});

db.connect((error)=>{
    if(error){
        console.log("error");
    }
    else{
        console.log("Connected to Database Successfully !")
    }
});


app.listen(5050, ()=> {
    console.log("server started on port 5050 !")
}); 

//this is to set handlebars as our view engine

app.set('view engine','hbs');

//views is a file where all of my html pages will be stored 

const publicDirectory = path.join(__dirname,'./public');

//publicdirectory is a file where all my css and js files ( for the front end ) will be stored 

app.use(express.static(publicDirectory));

//to parse URL-encoded bodies (as sent by html forms)

app.use(express.urlencoded({extended :false}));

// to make sure that the values we're grabbing have a type:JSON .   
app.use(express.json());

//Define routes 

app.use('/',require('./routes/pages'));

app.use('/auth',require('./routes/auth'));

