
const express=require("express");
const app=express();
const mongoose = require("mongoose");
const Listing=require("./models/listing.js");
const port=8080;
const path=require("path");
const methodOverride=require("method-override");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"))
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

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
  
//Index Route
app.get("/listings",async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});

});

//New Route 
app.get("/listings/new",async (req,res)=>{
  res.render("listings/new.ejs");

});
app.post("/listings", async (req,res)=>{
const newListings=new Listing(req.body.listing);
await newListings.save();
console.log(newListings)
res.redirect("/listings");
});
//Update Route
app.put("/listings/:id",async (req,res)=>{
  let {id}=req.params;
 await Listing.findByIdAndUpdate(id,{...req.body.listing});
 res.redirect("/listings");
});
//Show Route
app.get("/listings/:id",async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/show.ejs",{listing});

});
//Delete Route
app.delete("/listings/:id",async (req,res)=>{
  let {id}=req.params;
 const deletedListing=await Listing.findByIdAndDelete(id);
 console.log(deletedListing);
 res.redirect("/listings");

});
app.get("/listings/:id/edit",async (req,res)=>{
  let {id}=req.params;
  const listing=await Listing.findById(id);
res.render("listings/edit.ejs",{listing});
});

app.get("/",(req,res)=>{
   res.send("Hii i am root");
});
app.listen(port,()=>{
    console.log("server is listening on port" +port);
});