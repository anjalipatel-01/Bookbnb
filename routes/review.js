const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync =  require("../utils/wrapAsync.js");
const ExpressError =  require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const {listingschema, reviewschema } = require("../schema.js");
const {validateReview, isLoggedin, isReviewAuthor} = require("../middleware.js");
const Listing = require("../models/listing.js");

// <--review route-->
router.post("/",isLoggedin, validateReview,wrapAsync(async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newreview = new Reviews(req.body.review);
    newreview.author = req.user._id;
    listing.reviews.push(newreview);

    await newreview.save();
    await listing.save();
    req.flash("success","New Review created!");
    res.redirect(`/listings/${listing._id}`);
}));

//Delete Review Route 
router.delete("/:reviewId",isLoggedin,isReviewAuthor, wrapAsync(async(req,res)=>{
    let {id, reviewId} = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!");
    res.redirect(`/listings/${id}`);
})
);
module.exports = router;