const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const User=require("../models/user.js");
const passport = require('passport');
const { saveredirectUrl } = require("../middleware.js");


//Sign Up Authentication

router.get("/signUp",(req,res)=>{
res.render("users/signup.ejs");
});
router.post("/signUp", wrapAsync(async (req, res) => {
    try{

        let { username, email,password } = req.body;
        
        let newUser = new User({ email, username });
     const registeredUser = await User.register(newUser, password);
     req.login(registeredUser,(err) => {
      if (err) {
     return next(err);
     }
     req.flash("success","User Registered on Wanderlust");
     res.redirect("/listings");
    })
    
       
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signUp");
    }
    
     }));

     //Login Authentication
     router.get("/signIn",(req,res)=>{
        res.render("users/signin.ejs");
        });


        router.post('/signIn',saveredirectUrl,
            passport.authenticate("local", { failureRedirect: "/signIn" }),
             wrapAsync(async (req, res) => {
              let redirectUrl=res.locals.redirectUrl||"/listings";
               res.redirect(redirectUrl);
             }
           ));
          //Sign Out Authentication
          router.get("/signOut", async (req, res,next) => {
            req.logOut((err) => {
              if (err) {
             return next(err);
             }
            req.flash("success","User is sign Out");
              res.redirect("/listings");
            })
          }); 

 

module.exports=router;