//require packages 
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const  ejs = require("ejs");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
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
app.get("/listings",async (req,res)=>{
   const alllisting = await Listing.find({}); 
   res.render("listings/index.ejs",{alllisting});    
});
//new route
app.get("/listings/new", (req,res)=>{
    res.render("listings/newlisting.ejs");
});
//show route
app.get("/listings/:id", async(req,res)=>{
    let {id} =  req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
});
//route to create a new listing then add among other listings 
//create route
app.post("/listings",async(req,res)=>{
    const newlisting = new Listing(req.body.listing);
    await newlisting.save();
     res.redirect("/listings");
});
//edit route
app.get("/listings/:id/edit",async(req,res)=>{
    let {id} =  req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
});
//update route 
app.put("/listings/:id", async(req,res)=>{
    let {id} =  req.params;
   await Listing.findByIdAndUpdate(id,{...req.body.listing});
   res.redirect("/listings");
});
//delete route
app.delete("/listings/:id",async(req,res)=>{
    let {id} =  req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");

});
//starting your server
app.listen(8080,()=>{
    console.log("app is listening on 8080");
});