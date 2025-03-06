
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const port = 8080;
const path = require("path");
const ejsMate = require("ejs-mate");

const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const methodOverride = require("method-override");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")))
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const {listingSchema}=require("./schema.js");

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

//validation
const validatelisting=(req,res,next)=>{
  let {error}=listingSchema.validate(req.body);
  
 
  if(error){
    let errMsg=error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errMsg);
  }else{
    next();
  }
}

//Index Route
app.get("/listings", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });

}));

//New Route 
app.get("/listings/new", wrapAsync(async (req, res) => {
  res.render("listings/new.ejs");

}));


//Create Route
app.post("/listings",validatelisting, wrapAsync(async (req, res, next) => {

  const newListings = new Listing(req.body.listing);
  
  await newListings.save();
  console.log(newListings);
  res.redirect("/listings");

}));


//Update Route
app.put("/listings/:id",validatelisting, wrapAsync(async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect("/listings");
}));
//Show Route
app.get("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  id = id.trim();
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });

}));
//Delete Route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");

}));
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
});

app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"Page Not Found!"));
})
app.use((err, req, res, next) => {
  let {status=500,message="Some Error"}=err;
 res.status(status).render("error.ejs",{err});
});
app.get("/", (req, res) => {
  res.send("Hii i am root");
});
app.listen(port, () => {
  console.log("server is listening on port" + port);
});