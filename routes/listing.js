const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");


const { isloggedIn,isOwner,validatelisting}=require("../middleware.js");

const listingController=require("../controllers/listing.js");





//Index Route
router.get("/", wrapAsync(listingController.index));

//New Route 
router.get("/new",isloggedIn, wrapAsync(listingController.new));


//Create Route
router.post("/",validatelisting,isloggedIn, wrapAsync(listingController.create));


//Update Route
router.put("/:id",isloggedIn,isOwner,validatelisting, wrapAsync(listingController.update));


//Show Route

router.get("/:id", wrapAsync(listingController.show));
//Delete Route
router.delete("/:id",isloggedIn,isOwner, wrapAsync(listingController.delete));
//Edit Route
router.get("/:id/edit",isloggedIn,isOwner,wrapAsync(listingController.edit) );
module.exports=router;