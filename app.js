//jshint esversion:6
require('dotenv').config();
const bodyParser = require("body-parser");
const express=require("express");
const ejs=require("ejs");
const mongoose=require("mongoose");
const session = require("express-session");
const paassport=require("passport");
const PassportLocalMOngoose = require("passport-local-mongoose");
const passport = require('passport');


// const md5 = require('md5');
// const bcrypt=require("bcrypt");
// const saltrounds=5;
//const encrypt = require("mongoose-encryption");


const app=express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');
app.use(session({
    secret:"out little secret",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://127.0.0.1:27017/SecretDB");


const userschema=new mongoose.Schema({
    username:String,
    password:String
});


userschema.plugin(PassportLocalMOngoose);

//const secret =process.env.SECRET;
//userschema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });


const User=new mongoose.model("User",userschema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/",function(req,res){
    res.render("home");
});

app.get("/login",function(req,res){
    res.render("login");
});

app.get("/register",function(req,res){
    res.render("register");
})

app.get("/secrets",function(req,res){
    if(req.isAuthenticated()){
        res.render("secrets");
    }else{
        res.redirect("/login");
    }
});


app.post("/register",function(req,res){
   User.register({username:req.body.username}, req.body.password)
   .then((user)=>{
    passport.authenticate("local")(req,res,function(){
        res.redirect("/secrets");
    });
   })
   .catch((err)=>{
    console.log(err);
    res.redirect("/register");
   });


// bcrypt.hash(req.body.password,saltrounds)
//    .then((hash)=>{
//     const newuser=new User({
//         username:req.body.username,
//         password:hash
//     });
//     newuser.save()
//     .then(()=>{
//        res.render("secrets");
//     })
//     .catch((err)=>{
//         res.send(err);
//     });
//  })
//  .catch((err)=>{
//     res.send(err);
//  });
   
});

app.get("/submit",function(req,res){
   res.render("submit");
});

app.post("/login",function(req,res){
    const user=new User({
    username:req.body.username,
    password:req.body.password
    });

    req.login(user,function(err){
   if(err){
    console.log(err);
   }else{
    passport.authenticate("local")(req,res,function(){
        res.render("secrets");
    });
   }
    });

    // User.findOne({username:name})
    // .then((x)=>{
    //     if(x){
    //        bcrypt.compare(pass,x.password)
    //        .then((y)=>{
    //         if(y===true){
    //             res.render("secrets");
    //         }
    //        })
    //        .catch((err)=>{
    //         res.send(err);
    //        });
    //     }
    // })
    // .catch((err)=>{
    //     res.send(err);
    // });
});

app.get("/logout",function(req,res){
    req.logout(function(err){
        if(err){
            console.log(err);
        }else{
            res.render("home");
        }
    });
});

app.listen(3000,function(req,res){
  console.log("server started at port 3000");
});


