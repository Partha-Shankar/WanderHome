module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){
        req.flash("error","You must be Logged in to create listings");
        return res.redirect("/login");
    }
    next();
}