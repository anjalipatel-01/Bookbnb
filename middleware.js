const Listing = require("./models/listing");
const ExpressError =  require("./utils/ExpressError.js");
const {listingschema, reviewschema } = require("./schema.js");

module.exports.isLoggedin = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
            req.flash("error", "You must be logged in!");
           return res.redirect("/login");
        }
        next();
};

module.exports.saveRedirecturl = (req,res,next)=>{
        if(req.session.redirectUrl){
           res.locals.redirectUrl = req.session.redirectUrl;
        }
        next();
};

module.exports.isOwner = async(req,res,next)=>{
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner.equals(res.locals.curruser._id)) {
        req.flash("error", "You are not the owner of this listing!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateListing = (req, res, next) => {
    let { error } = listingschema.validate(req.body);
    if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);   
    } else {
    next();
    }
};

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewschema.validate(req.body);
    if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);   
    } else {
    next();
    }
};

module.exports.isReviewAuthor = async(req,res,next)=>{
    let { id, reviewId } = req.params;
    let listing = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.curruser._id)) {
        req.flash("error", "You are not the author of this review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};