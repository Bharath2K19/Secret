//jshint esversion:6
require('dotenv').config();
const bodyParser = require("body-parser");
const express=require("express");
const ejs=require("ejs");
const mongoose=require("mongoose");

const encrypt = require("mongoose-encryption");


const app=express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');

mongoose.connect("mongodb://127.0.0.1:27017/SecretDB");

const userschema=new mongoose.Schema({
    username:String,
    password:String
});


const secret =process.env.SECRET;
userschema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });


const User=new mongoose.model("User",userschema);



app.get("/",function(req,res){
    res.render("home");
});

app.get("/login",function(req,res){
    res.render("login");
});

app.get("/register",function(req,res){
    res.render("register");
})


app.post("/register",function(req,res){
    const newuser=new User({
        username:req.body.username,
        password:req.body.password
    });
    newuser.save()
    .then(()=>{
       res.render("secrets");
    })
    .catch((err)=>{
        res.send(err);
    });
});

app.get("/submit",function(req,res){
   res.render("submit");
});

app.post("/login",function(req,res){
    const name=req.body.username;
    const pass=req.body.password;

    User.findOne({username:name})
    .then((x)=>{
        if(x){
            if(x.password===pass){
                res.render("secrets");
            }
           console.log(x);
        }
    })
    .catch((err)=>{
        res.send(err);
    });
});

app.get("/logout",function(req,res){
    res.render("home");
});

app.listen(3000,function(req,res){
  console.log("server started at port 3000");
});


