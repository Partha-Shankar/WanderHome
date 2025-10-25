const express = require("express");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const router = express.Router({mergeParams:true});
const { isLoggedIn, validatelisting, isOwner } = require("../middleware.js");


router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings});
}));
//new Route
router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new.ejs");
});
//Read or Show Route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({
        path:"reviews",
        populate:{
            path:"author",
        },
    })
    .populate("owner");
    res.render("listings/show.ejs", { listing });
}));
router.post("/",
    isLoggedIn,
    validatelisting,
    wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success","New Listing Created Sucessfully!");
    res.redirect("/listings");
}));
//EditRoute
router.get("/:id/edit",isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
}));
//update Route
router.put("/:id", isLoggedIn, isOwner, validatelisting, wrapAsync(async(req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
}));
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async(req,res) =>{
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

module.exports = router;