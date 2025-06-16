const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync =  require("../utils/wrapAsync.js");
const ExpressError =  require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const {listingschema, reviewschema } = require("../schema.js");
const {validateReview, isLoggedin, isReviewAuthor} = require("../middleware.js");
const Listing = require("../models/listing.js");
const reviewController = require("../controllers/review.js");

// <--review route-->
router.post("/",isLoggedin, 
    validateReview,
    wrapAsync(reviewController.createreview));

//Delete Review Route 
router.delete("/:reviewId",isLoggedin,
    isReviewAuthor, 
    wrapAsync(reviewController.destroyReview));

module.exports = router;