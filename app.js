
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const port = 8080;
const path = require("path");
const ejsMate = require("ejs-mate");
const flash = require('connect-flash');


const ExpressError = require("./utils/ExpressError.js");
const methodOverride = require("method-override");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")))
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const User = require("./models/user"); 


//Routers
const listings=require("./routes/listing.js");
const reviews=require("./routes/reviews.js");
const user=require("./routes/user.js");

app.use(session({
  secret: 'mysupersecretcode',  
  resave: false,  
  saveUninitialized: true,  
  cookie:{
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true
  }
 
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}



app.get("/", (req, res) => {
  res.send("Hii i am root");
});
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currUser = req.user;
  
  next();
});

app.use("/listings",listings);
app.use("/listings/:id/reviews", reviews);


app.use("/",user);




app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"Page Not Found!"));
})
app.use((err, req, res, next) => {
  let {status=500,message="Some Error"}=err;
 res.status(status).render("error.ejs",{err});
});

app.listen(port, () => {
  console.log("server is listening on port" + port);
});