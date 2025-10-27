const Listing = require("../models/listing.js");

module.exports.getAllListings = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings});
};

module.exports.getNewListing = (req, res) => {
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
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
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
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async(req,res) =>{
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
};