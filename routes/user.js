const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");

const passport = require('passport');
const { saveredirectUrl } = require("../middleware.js");
const userController=require("../controllers/user.js");


//Sign Up Authentication

router.get("/signUp",userController.signUpForm);
router.post("/signUp", wrapAsync(userController.signUp));

     //Login Authentication
     router.get("/signIn",userController.signInForm);


        router.post('/signIn',saveredirectUrl,
            passport.authenticate("local", { failureRedirect: "/signIn" }),
             wrapAsync(userController.signIn
           ));
          //Sign Out Authentication
          router.get("/signOut", userController.signOut); 

 

module.exports=router;