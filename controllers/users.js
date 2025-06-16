const User = require("../Models/user");
module.exports.renderSignupForm = (req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signup = async(req,res)=>{
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
};

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login =  async(req,res)=>{
        req.flash("success","Welcome back to Wanderlust!");
        let redirecturl = res.locals.redirectUrl || "/listings";
        res.redirect(redirecturl);
};

module.exports.logout = (req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listings");
    })
};