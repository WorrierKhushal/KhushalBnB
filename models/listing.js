const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const { type } = require("os");


const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url:String,
    filename:String,
  },
  price:{
    type:Number,
    required: true,
    min : 0,
  },
  location:{
    type:String,
    required: true,
  },
  country:{
    type: String,
    required: true,
  },
  reviews: [
    {
        type: Schema.Types.ObjectId,
        ref:"Review",
    },
  ],
  owner : {
    type : Schema.Types.ObjectId,
    ref:"User",
  },
});

listingSchema.post("findOneAndDelete", async(listing)=> {
    if(listing) {
        await Review.deleteMany({_id : {$in: listing.reviews }});
    }
});

module.exports = mongoose.model("Listing", listingSchema);
