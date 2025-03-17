
const express = require("express");
const app = express();
const mongoose = require("mongoose");

const port = 8080;
const path = require("path");
const ejsMate = require("ejs-mate");


const ExpressError = require("./utils/ExpressError.js");
const methodOverride = require("method-override");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")))
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

const listings=require("./routes/listing.js");
const reviews=require("./routes/reviews.js");


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


app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);




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