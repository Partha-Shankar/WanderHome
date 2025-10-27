const User = require("../models/user.js");

module.exports.getSignup = (req,res) => {
    res.render("users/signUp.ejs");
};

module.exports.postSignup = async(req,res) => {
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
};

module.exports.getLogin = (req,res) => {
    res.render("users/login.ejs");
};

module.exports.postLogin = async(req,res) => {
    res.locals.redirectUrl = req.session.redirectUrl || "/listings";
    req.flash("success","Welcome to wanderHome");
    res.redirect(res.locals.redirectUrl);
}

module.exports.getlogout = (req,res,next) => {
    req.logout((err) => {
        if(err){
            return next(err);
        }
        req.flash("success","You have Logged out successfully! | We Miss you ");
        res.redirect("/listings");
    });
};
