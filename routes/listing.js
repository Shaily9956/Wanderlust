const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");

const multer  = require('multer');
const {storage}=require("../cloudCongfig.js");
const upload = multer({ storage});



const { isloggedIn,isOwner,validatelisting}=require("../middleware.js");

const listingController=require("../controllers/listing.js");


router.route("/")
.get( wrapAsync(listingController.index))
.post(isloggedIn,upload.single('listing[image]') ,validatelisting, wrapAsync(listingController.create))
//New Route 
router.get("/new",isloggedIn, wrapAsync(listingController.new));


router.route("/:id")
.put(isloggedIn,upload.single('listing[image]'),isOwner,validatelisting, wrapAsync(listingController.update))
.get( wrapAsync(listingController.show))
.delete(isloggedIn,isOwner, wrapAsync(listingController.delete))

router.get("/:id/edit",isloggedIn,isOwner,wrapAsync(listingController.edit) );
module.exports=router;