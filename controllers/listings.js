// MBC (model view controllers) style:
const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");


module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  return res.render("listings/index", { allListings });
};


module.exports.renderNewForm = (req , res) => {
  return res.render("listings/new", { error: null, listing: {} });
};

module.exports.createListing = async (req , res) => {
    let url, filename;
    if (req.file) {
        url = req.file.path;
        filename = req.file.filename;
        console.log(url, ",", filename);
    }

    const { error } = listingSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error.details[0].message);
    }

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    
    if(url && filename){
        newListing.image = {url , filename};
    }
    await newListing.save();
    
    req.flash("sucess", "New Listing created!");
    return res.redirect(`/listings`);
};

module.exports.showListing = async (req, res) => {
  const listing = await Listing.findById(req.params.id)
  .populate({path: "reviews",
    populate: {
      path: "author",
  },
}).populate("owner");

  if (!listing) {
    req.flash("error", "Listing you requested for does not exits");
    return res.redirect("/listings");
  }
  console.log(listing);
  return res.render("listings/show", { listing });
};

module.exports.renderEditForm = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    req.flash("error", "Listing you requested for edit  does not exits");
    return res.redirect("/listings");
  }
  let originalImageurl = listing.image.url;
  originalImageurl = originalImageurl.replace("/upload" , "/upload/,w_250")
  return res.render("listings/edit", { error: null, listing , originalImageurl });
};

// update listing code mvc framework
module.exports.updateListing =async (req, res) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error.details[0].message);
    }
    const { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(
        req.params.id,
        req.body.listing,
        { runValidators: true }
    );

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename}
        await listing.save();
    }

    req.flash("sucess", "Listing Updated");
    return res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  await Listing.findByIdAndDelete(req.params.id);
  req.flash("sucess", "Listing is Deleted");
  return res.redirect("/listings");
};
