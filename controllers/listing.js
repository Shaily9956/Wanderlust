const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });

}

module.exports.new = async (req, res) => {
    res.render("listings/new.ejs");

}

module.exports.create=async (req, res, next) => {
  let url=req.file.path;
  let filename=req.file.filename


    const newListings = new Listing(req.body.listing);
    newListings.owner=req.user._id;
    newListings.image={url,filename}
    
    await newListings.save();
    req.flash('success', 'New Listing created');
  
    res.redirect("/listings");
  
  }

  module.exports.update=async (req, res) => {

    
    let { id } = req.params;
    let updatedListing=await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file!=="undefined"){
      let url=req.file.path;
      let filename=req.file.filename
    
        updatedListing.image={url,filename};
        await updatedListing.save(); 
    }
   
    req.flash('success', ' Listing Updated');
    res.redirect(`/listings/${id}`);
  }

  module.exports.show=async (req, res) => {
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
  
  }

  module.exports.delete=async (req, res) => {
    let { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    req.flash('success', 'Listing Deleted');
   
    res.redirect("/listings");
  
  }

  module.exports.edit=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error","Listing you requested for does not exist");
      res.redirect("/listings");
    }
    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_260");
    res.render("listings/edit.ejs", { listing,originalImageUrl });
  }
