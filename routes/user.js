const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");

const passport = require('passport');
const { saveredirectUrl } = require("../middleware.js");
const userController=require("../controllers/user.js");


router.route("/signUp")
.get(userController.signUpForm)
.post( wrapAsync(userController.signUp))

     //Login Authentication

     router.route("/signIn")
     .get(userController.signInForm)
     .post(saveredirectUrl,
      passport.authenticate("local", { failureRedirect: "/signIn" }),
       wrapAsync(userController.signIn
     ))


      
          //Sign Out Authentication
          router.get("/signOut", userController.signOut); 

 

module.exports=router;