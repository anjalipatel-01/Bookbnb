//require packages 
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const  ejs = require("ejs");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const wrapAsync =  require("./utils/wrapAsync.js");
const ExpressError =  require("./utils/ExpressError.js");
const Reviews = require("./models/review.js");
//establishing database connection
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main().then(()=>{
    console.log("connected to db");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(MONGO_URL);
}
app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine("ejs",ejsmate);
app.use(express.static(path.join(__dirname,"/public")));

//basic api request
app.get("/",(req,res)=>{
    res.send("hi i am root");
});
//route the listings
//index route
app.get("/listings", wrapAsync (async (req,res)=>{
   const alllisting = await Listing.find({}); 
   res.render("listings/index.ejs",{alllisting});    
})
);
//new route
app.get("/listings/new", (req,res)=>{
    res.render("listings/newlisting.ejs");
});
//show route
app.get("/listings/:id", wrapAsync( async(req,res)=>{
    let {id} =  req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
})
);
//route to create a new listing then add among other listings 
//create route
    app.post("/listings",wrapAsync (async(req,res)=>{
        const newlisting = new Listing(req.body.listing);
        await newlisting.save();
         res.redirect("/listings");
    })
    );
//edit route
app.get("/listings/:id/edit", wrapAsync(async(req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"Send valid data for Listing");          
    }
    let {id} =  req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
})
);
//update route 
app.put("/listings/:id", wrapAsync(async(req,res)=>{
    let {id} =  req.params;
   await Listing.findByIdAndUpdate(id,{...req.body.listing});
   res.redirect("/listings");
})
);
//delete route
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    let {id} =  req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");

})
);
// <--review route-->
app.post("/listings/:id/reviews", async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newreview = new Reviews(req.body.review);
    listing.reviews.push(newreview);
    await newreview.save();
    await listing.save();
    console.log("new review saved");
    res.send("review saved");


});
    
//if user access a page whose route is not defined
app.all(/(.*)/, (req,res,next)=>{
    next(new ExpressError(404,"Page not Found"));
});
// MIDDLEWARE FOR ERROR 
app.use((err,req,res,next)=>{
    let {statuscode=500,message = "something went wrong"} = err;
    res.render("error.ejs");
    // res.status(statuscode).send(message);
});



//starting your server
app.listen(8080,()=>{
    console.log("app is listening on 8080");
});