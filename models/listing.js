const  mongoose = require("mongoose")
const Schema = mongoose.Schema;
//make schema of a new listing
const listingSchema = new Schema({
    title: {
        type:String,
        require: true
    },
    description: String,
    image: {
        filename: String,
        url: String,  
        //if the image is undefined
        // default:"https://unsplash.com/photos/sunloungers-fronting-buildings-near-mountain-DGa0LQ0yDPc",
        // //setting default image is empty 
        // set: (v)=> v ==="" ? "https://unsplash.com/photos/sunloungers-fronting-buildings-near-mountain-DGa0LQ0yDPc":v,
    },
    price:Number,
    location : String,
    country:String,
});
const Listing = mongoose.model("Listing",listingSchema);
module.exports=Listing;