const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema}=require("../schema.js");
const { isloggedIn,isOwner}=require("../middleware.js");
const Listing = require("../models/listing.js");



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
router.get("/", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });

}));

//New Route 
router.get("/new",isloggedIn, wrapAsync(async (req, res) => {
 
  res.render("listings/new.ejs");

}));


//Create Route
router.post("/",validatelisting,isloggedIn, wrapAsync(async (req, res, next) => {

  const newListings = new Listing(req.body.listing);
  newListings.owner=req.user._id;
  
  await newListings.save();
  req.flash('success', 'New Listing created');

  res.redirect("/listings");

}));


//Update Route
router.put("/:id",isloggedIn,isOwner,validatelisting, wrapAsync(async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  req.flash('success', ' Listing Updated');
  res.redirect(`/listings/${id}`);
}));


//Show Route

router.get("/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  id = id.trim();
  const listing = await Listing.findById(id).populate({path:"reviews",populate:{
    path:"author"
  }}).populate("owner");

  if(!listing){
    req.flash('error', 'Listing you requested does not exist!');
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });

}));
//Delete Route
router.delete("/:id",isloggedIn,isOwner, wrapAsync(async (req, res) => {
  let { id } = req.params;
  const deletedListing = await Listing.findByIdAndDelete(id);
  req.flash('success', 'Listing Deleted');
 
  res.redirect("/listings");

}));
//Edit Route
router.get("/:id/edit",isloggedIn,isOwner, async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  });
module.exports=router;