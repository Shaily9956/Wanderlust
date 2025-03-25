const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");



const { isloggedIn,isAuthor,validateReview}=require("../middleware.js");

const reviewController=require("../controllers/reviews.js");

  


  //Reviews Route for particular listings
router.post("/",isloggedIn,validateReview, wrapAsync(reviewController.createReview));
  // Delete Review route
  
  router.delete("/:reviewId",isloggedIn,isAuthor,wrapAsync(reviewController.deleteReview));
  
  module.exports=router;