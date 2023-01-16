var nodemailer = require('nodemailer');
const dotenv =require("dotenv");
const path  =require("path");
dotenv.config({path:'./.env'});

var smtpTransport = require('nodemailer-smtp-transport');



exports.mail=async(req,res)=>{
    const email=req.body.email;
    const name=req.body.name;
    const message=req.body.message;

    const output=`
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>  
      <li>Name: ${name}</li>
      <li>Email: ${email}</li>
    </ul>
    <h3>Message</h3>
    <p>${message}</p>
  `;
  console.log(req.body);
  let transporter = nodemailer.createTransport(smtpTransport({
    service:"gmail",
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, 

    auth: {
        user: 'lazrak20016@gmail.com', 
        pass: process.env.EMAIL_PASSWORD
    },
  }));
  let Details ={
    from : "lazrak20016@gmail.com",
    to:"sadikmarouane123@gmail.com",
    subject:"Contact_May_Market",
    html:output
  }
  transporter.sendMail(Details,(err)=>{
    if(err){
        console.log(err);
    }else{
        console.log("an email has been sent");
        res.render('index', {msg:'Email has been sent'});
    }
  })

};


    