const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');

module.exports.index = async (req, res)=>{
        const alllisting = await Listing.find({}); 
        res.render("listings/index.ejs", {alllisting});    
};

module.exports.renderNewForm = (req,res)=>{
        res.render("listings/newlisting.ejs");
};

module.exports.showlisting = async(req,res)=>{
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
};

module.exports.createListing = async(req,res)=>{
        let url = req.file.path;
        let filename = req.file.filename;
        const newlisting = new Listing(req.body.listing);
        newlisting.owner = req.user._id;
        newlisting.image = {url,filename};
        await newlisting.save();
        req.flash("success","New Listing created!");
         res.redirect("/listings");
};

module.exports.editListing = async(req,res)=>{
        let {id} =  req.params;
        const listing = await Listing.findById(id);
         if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
        }
        let imageUrl = listing.image.url;
         imageUrl = imageUrl.replace("/upload","/upload/h_300,w_250")
        res.render("listings/edit.ejs", { listing, imageUrl });
};

module.exports.updateListing = async(req,res)=>{
        let {id} =  req.params;
        let lisitng = await Listing.findByIdAndUpdate(id,{...req.body.listing});

        if(typeof req.file !== "undefined"){
                let url = req.file.path;
                let filename = req.file.filename;
                 lisitng.image = {url,filename};
                await listing.save();
        }

        req.flash("success","Listing Updated!");
        let listing = await Listing.findById(id);
        if(!listing){
            req.flash("error","Listing you requested for does not exsist!");
            res.redirect("/listings");
        }
        res.redirect(`/listings/${id}`);
};
module.exports.destroyListing = async(req,res)=>{
        let {id} =  req.params;
        await Listing.findByIdAndDelete(id);
        req.flash("success","Listing Deleted!");
        res.redirect("/listings");
  };