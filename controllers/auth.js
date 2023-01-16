const mysql = require("mysql");
const jwt= require("jsonwebtoken");
const bcrypt=require("bcryptjs");
const dotenv =require("dotenv");
const { promisify }= require('util');
const async = require("hbs/lib/async");

const db=mysql.createConnection({
    host:process.env.DATABASE_HOST,
    user:process.env.DATABASE_USER,
    password:process.env.DATABASE_PASSWORD,
    database:process.env.DATABASE
});

exports.register =(req,res)=> {
    console.log(req.body);
    
    const name =req.body.name;
    const email=req.body.email;
    const phone=req.body.phone;
    const city=req.body.city;
    const country=req.body.country;
    const password =req.body.password;
    const passwordConfirm =req.body.passwordConfirm;
    const gender=req.body.gender;

    db.query('SELECT email FROM users WHERE email =?',[email], async(error,results)=>{
        if(error){console.log(error);}
        if(results.length>0){
            return res.render('register',{
                message :'that email is already used'
            })
        }
        else if(password != passwordConfirm){
            return res.render('register',{
                message :'password do not match'
            })
        }

        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);

        
        db.query('INSERT INTO users SET ?',{name :name, email : email, password: hashedPassword, phone :phone, city :city, country :country, gender: gender},(error, results)=>{
            if(error){console.log(error)}
            else{
                console.log(results);
                return res.render('register',{
                    message:'User Registered'
                });
            }
        })
    });
}

exports.login =(req,res)=>{
    try{
        const email=req.body.email;
        const password=req.body.password;

        if(!email || !password){
            return res.status(400).render('login',{
                message:'You should provide a valid email and password please !'
            })
        }
        db.query('SELECT * FROM users WHERE email=?',[email], async(error,results)=>{
            if(!results || !(await bcrypt.compare(password,results[0].password))){
                res.status(401).render('login',{
                    message:'Wrong email or password'
                })
            }else{
                const id=results[0].User_id;
                const token=jwt.sign({id: id}, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN 
                });

                console.log("the Token is : "+ token);

                const CookieOptions = {
                    expires : new Date(
                        Date.now() + (process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000) 

                    //multiplication par ... juste pour transformer la variable en milisecondes 
                    ),
                    httpOnly : true
                }
                //set up de la cookie dans le navigateur , avec trois params : le nom , le token et les options de cookie .

                res.cookie('jwt', token, CookieOptions);
                res.status(200).redirect('/');
            }
        })


    }catch(error){
        console.log(error);
    };
    
}

exports.isLoggedIn = async(req, res, next)=>{
    console.log(req.cookies);
    if(req.cookies.jwt){
        try{
            //we're trying to grap the user id from the cookie value 
            const decoded = await promisify(jwt.verify)(req.cookies.jwt,process.env.JWT_SECRET);
            //console.log(decoded);

            //check if the user still exists in the database 
            db.query('SELECT * FROM users WHERE User_id = ?',[decoded.id],(error,result)=>{
                //console.log(result);
                
                if(!result){
                    return next();
                }
                req.user = result[0];
                return next();
                
            })

        }catch(error){
            console.log(error);
        }
    }else{
        next();
    }

 
}

exports.logout= async(req,res)=>{
    res.clearCookie('jwt');
    setTimeout(()=>{res.status(200).redirect('/')}, 500);;
}

