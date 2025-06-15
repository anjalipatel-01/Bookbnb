const  mongoose = require("mongoose");
const review = require("./review");
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
    reviews: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Reviews"
        }
      ],
      owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
      }
      
});
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
      await review.deleteMany({reviews:{$in:listing.reviews}});
    }
});
const Listing = mongoose.model("Listing",listingSchema);
module.exports=Listing;
