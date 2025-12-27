const mongoose =  require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO = "mongodb://127.0.0.1:27017/Wanderlust";

main().then(() => {
    console.log("Connected To DB");
}).catch((err) => {
    console.log(err);
});

async function main() {
  await mongoose.connect(MONGO);
}

const initDB = async()=> {
    await Listing.deleteMany({});

    initData.data = initData.data.map((obj) => ({ 
        ...obj,
        owner:"694c0e2b10669bb6b496f0bb"
    }));
    
    await Listing.insertMany(initData.data);
    console.log("Data was initialize!");
};

initDB();
