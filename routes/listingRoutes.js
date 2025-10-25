const express = require("express");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const { listingSchema} = require("../schema.js");
const router = express.Router({mergeParams:true});
const { isLoggedIn } = require("../middleware.js");

const validatelisting = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new expressError(400,errMsg);
    }else{
        next();
    }
}

router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings});
}));
//new Route
router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new.ejs");
});
//Read or Show Route
router.get("/:id", isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    res.render("listings/show.ejs", { listing });
}));
router.post("/",validatelisting, wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success","New Listing Created Sucessfully!");
    res.redirect("/listings");
}));
//EditRoute
router.get("/:id/edit",isLoggedIn, wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
}));
//update Route
router.put("/:id", validatelisting, wrapAsync(async(req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
}));
router.delete("/:id",wrapAsync(async(req,res) =>{
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

module.exports = router;