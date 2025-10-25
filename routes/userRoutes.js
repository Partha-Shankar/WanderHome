const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const router = express.Router({mergeParams:true});
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
 
router.get("/signup", (req,res) => {
    res.render("users/signUp.ejs");
});

router.post("/signup", wrapAsync(async(req,res) => {
    try{
        let{userName, email, password} = req.body;
        const newUser = new User({email,username: userName});
        const registeredUser = await User.register(newUser,password);
        req.login(registeredUser, (err) => {
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome to WanderHome");
            res.redirect("/listings");
        });
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}));

router.get("/login",(req,res) => {
    res.render("users/login.ejs");
});

router.post("/login",saveRedirectUrl,
    passport.authenticate("local",{
        failureRedirect:"/login",
        failureFlash:true,
    }),
    wrapAsync(async(req,res) => {
        req.flash("success","Welcome to wanderHome");
        res.redirect(res.locals.redirectUrl);
    })
);

router.get("/logout",(req,res,next) => {
    req.logout((err) => {
        if(err){
            return next(err);
        }
        req.flash("success","You have Logged out successfully! | We Miss you ");
        res.redirect("/listings");
    });
});

module.exports = router;