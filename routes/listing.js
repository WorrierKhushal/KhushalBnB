const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");

const {isLoggedIn, isOwner} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");  
const {storage} = require("../cloudConfig.js");

const upload = multer({storage}); //yeh us folder ka path hainn jaha par data store hota hain 



router.route("/")
.get ( wrapAsync(listingController.index))

.post (
  isLoggedIn, 
  upload.single('listing[image]'),
  wrapAsync(listingController.createListing),
);


// NEW    
router.get("/new",isLoggedIn ,listingController.renderNewForm);

// CREATE       
router.route("/:id")
.get(wrapAsync(listingController.showListing))
// update route
.put(
  isLoggedIn,
  isOwner,
  upload.single('listing[image]'),
  wrapAsync(listingController.updateListing))
  
.delete(isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));

// EDIT
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));





// // INDEX
//  // router.get("/" , wrapAsync(listingController.index));


//  // router.post("/",isLoggedIn, wrapAsync(listingController.createListing));

// SHOW
// router.get("/:id", wrapAsync(listingController.showListing));


// UPDATE 
// router.put("/:id",isLoggedIn,isOwner,wrapAsync(listingController.updateListing));

// DELETE
// router.delete("/:id",isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));

module.exports = router;


