const mongoose=require("mongoose");
const Listing=require("../models/listing.js");
const initData = require("./data.js");
const Mongo_URL="mongodb://127.0.0.1:27017/wanderlust";
main().then((res) => {
    console.log("connection successfully");
}).catch((err) => console.log(err));

async function main() {
    await mongoose.connect(Mongo_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
   initData.data= initData.data.map((obj)=>({...obj,owner:"67dbbad10ad2eafe5d2082c8"}));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
  };
  
  initDB();