const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const User=require("../models/user.js");
const passport = require('passport');


//Sign Up Authentication

router.get("/signUp",(req,res)=>{
res.render("users/signup.ejs");
});
router.post("/signUp", wrapAsync(async (req, res) => {
    try{

        let { username, email,password } = req.body;
        
        let newUser = new User({ email, username });
     const registeredUser = await User.register(newUser, password);
     req.flash("success","User Registered on Wanderlust");
     res.redirect("/listings");
       
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signUp");
    }
    
     }));

     //Login Authentication
     router.get("/signIn",(req,res)=>{
        res.render("users/signin.ejs");
        });


        router.post('/signIn',
            passport.authenticate("local", { failureRedirect: "/signIn" }),
             wrapAsync(async (req, res) => {
              
               res.redirect("/listings");
             }
           ));

module.exports=router;