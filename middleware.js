const { session } = require("passport");
const Listing = require("./models/listing");
const Review = require("./models/review");


module.exports.isLoggedIn =  (req , res , next) => {
    // console.log(req.path, "..", req.originalUrl);
    if(!req.isAuthenticated()) {
        // redirect url saving
        req.session.redirectUrl = req.originalUrl;
        req.flash("error" ,  "you must be logged in to create listings");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner =  async(req,res,next) =>{
    const { id } = req.params;
    let  listing =  await Listing.findById(id);

    if (!listing.owner.equals(req.user._id)) {
        req.flash("error","you are not Owner of this listings!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

// koi bhi aa kar reviews delete na kar sake uske liye
module.exports.isReviewAuthor =  async(req,res,next) =>{
    const {id,reviewId } = req.params;
    let  review =  await Review.findById(reviewId);
    
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error","you are not the author of this Review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

