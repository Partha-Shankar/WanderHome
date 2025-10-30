const Listing = require("../models/listing.js");
const expressError = require("../utils/expressError.js");

module.exports.getAllListings = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings});
};

module.exports.getNewListing = async (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.getIndividualListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({
        path:"reviews",
        populate:{
            path:"author",
        },
    })
    .populate("owner");
    res.render("listings/show.ejs", { listing });
};

module.exports.postNewListing = async (req, res) => {
    if (!req.file){
        return next(new expressError(404,"Image is Required"));
    }
    // const allowed = ["image/jpeg", "image/png"];
    // if (!allowed.includes(req.file.mimetype)) {
    //     return next(new expressError(400, "Only JPG/PNG images allowed"));
    // }
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {filename,url};
    await newListing.save();
    req.flash("success","New Listing Created Sucessfully!");
    res.redirect("/listings");
};

module.exports.getEditListing = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
};

module.exports.putEditListing = async(req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {filename,url};
        await listing.save();
    }
    req.flash("success","Sucessfully Edited!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async(req,res) =>{
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
};