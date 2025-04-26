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

    },
    price:Number,
    location : String,
    country:String,
    reviews:[{
        type: Schema.Types.ObjectId,
        ref : "Reviews",
    }]
});
const Listing = mongoose.model("Listing",listingSchema);
module.exports=Listing;