if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
    console.log(process.env);
}

//require packages 
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const  ejs = require("ejs");
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./Models/user.js");
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

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

const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
}

app.get("/", (req,res)=>{
    res.send("Hi, i am root");
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.curruser = req.user;
    next();
});

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);
    
//if user access a page whose route is not defined
app.all(/(.*)/, (req,res,next)=>{
    next(new ExpressError(404,"Page not Found"));
});
// MIDDLEWARE FOR ERROR 
app.use((err,req,res,next)=>{
    let {statusCode=500,message = "something went wrong"} = err;
    res.status(statusCode).render("error.ejs",{message});
    // res.status(statuscode).send(message);
});

//starting your server
app.listen(8080,()=>{
    console.log("app is listening on 8080");
});