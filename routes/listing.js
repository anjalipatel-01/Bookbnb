const express = require("express");
const router = express.Router();
const wrapAsync =  require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedin, isOwner, validateListing} = require("../middleware.js");
const ExpressError =  require("../utils/ExpressError.js");


//index route
    router.get("/", wrapAsync (async (req,res)=>{
        const alllisting = await Listing.find({}); 
        res.render("listings/index.ejs",{alllisting});    
         })
    );
//new route
    router.get("/new", isLoggedin, (req,res)=>{
        res.render("listings/newlisting.ejs");
    });
//show route
    router.get("/:id", wrapAsync( async(req,res)=>{
        let {id} =  req.params;
        const listing = await Listing.findById(id).populate("owner").populate({path: "reviews",populate:{
            path: "author",
        },
    });
        if(!listing){
            req.flash("error","Listing you requested for does not exsist!");
            res.redirect("/listings");
        }
        res.render("listings/show.ejs",{listing});
        })
    );
//route to create a new listing then add among other listings 
//create route
    router.post("/",
        validateListing,isLoggedin,
        wrapAsync (async(req,res)=>{
        const newlisting = new Listing(req.body.listing);
        newlisting.owner = req.user._id;
        await newlisting.save();
        req.flash("success","New Listing created!");
         res.redirect("/listings");
        })
    );
//edit route
    router.get("/:id/edit",isLoggedin, wrapAsync(async(req,res)=>{
         if(!req.body.listing){
            throw new ExpressError(400,"Send valid data for Listing");          
        }
         let {id} =  req.params;
        const listing = await Listing.findById(id);
        res.render("listings/edit.ejs",{listing});
         })
    );
//update route 
    router.put("/:id",isLoggedin,
        isOwner,validateListing,
        wrapAsync(async(req,res)=>{
        let {id} =  req.params;
        await Listing.findByIdAndUpdate(id,{...req.body.listing});
        req.flash("success","Listing Updated!");
        let listing = await Listing.findById(id);
        if(!listing){
            req.flash("error","Listing you requested for does not exsist!");
            res.redirect("/listings");
        }
        res.redirect(`/listings/${id}`);
        })
    );
//delete route
    router.delete("/:id",isLoggedin,
        isOwner,
        wrapAsync(async(req,res)=>{
        let {id} =  req.params;
        await Listing.findByIdAndDelete(id);
        req.flash("success","Listing Deleted!");
        res.redirect("/listings");
        })
    );
     
module.exports = router; 