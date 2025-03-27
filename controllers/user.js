
const User=require("../models/user.js");


module.exports.signUpForm=(req,res)=>{
res.render("users/signup.ejs");
}

module.exports.signInForm=(req,res)=>{
    res.render("users/signin.ejs");
    }

    module.exports.signUp=async (req, res) => {
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
        
         }


         module.exports.signIn=async (req, res) => {
            let redirectUrl=res.locals.redirectUrl||"/listings";
             res.redirect(redirectUrl);
           }

           module.exports.signOut=async (req, res,next) => {
            req.logOut((err) => {
              if (err) {
             return next(err);
             }
            req.flash("success","User is sign Out");
              res.redirect("/listings");
            })
          }
    