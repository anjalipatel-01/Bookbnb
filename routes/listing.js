const express = require("express");
const router = express.Router();
const wrapAsync =  require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedin, isOwner, validateListing} = require("../middleware.js");
const ExpressError =  require("../utils/ExpressError.js");
const listingController = require("../controllers/listing.js");
const multer = require('multer');
const {storage} = require("../cloudconfig.js");
const upload = multer({storage});
//new route
    router.get("/new", isLoggedin,listingController.renderNewForm);
    
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedin, 
        upload.single("listing[image]"),
        validateListing,
        wrapAsync (listingController.createListing)
    );
router.get("/category/:category", wrapAsync(listingController.listByCategory));

router.route("/:id")
    .get(wrapAsync(listingController.showlisting)) //show route
    .put(isLoggedin,
        isOwner,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.updateListing)) //update route
    .delete(isLoggedin,
        isOwner,
        wrapAsync(listingController.destroyListing)
    );    

//edit route
    router.get("/:id/edit",isLoggedin, wrapAsync(listingController.editListing));
     
module.exports = router; 