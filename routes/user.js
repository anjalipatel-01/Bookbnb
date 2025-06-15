const express = require("express");
const router = express.Router();
const User = require("../Models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirecturl } = require("../middleware");

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync(async(req,res)=>{
    try{
        let {username,email,password} = req.body;
        const newUser = new User({email,username});
        const regitereduser = await  User.register(newUser,password);
        console.log(regitereduser);
        req.login(regitereduser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to Wanderlust!");
             res.redirect("/listings");
        })    
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
})
);

router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});

router.post("/login", saveRedirecturl, passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}), 
    async(req,res)=>{
        req.flash("success","Welcome back to Wanderlust!");
        let redirecturl = res.locals.redirectUrl || "/listings";
        res.redirect(redirecturl);
});

router.get("/logout",(req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listings");
    })
});

module.exports = router;