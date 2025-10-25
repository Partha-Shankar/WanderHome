const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const router = express.Router({mergeParams:true});
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const { isLoggedIn, validateReview, isReviewAuthor} = require("../middleware.js");

router.post("/",isLoggedIn, validateReview, wrapAsync(async(req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","New review created");
    res.redirect(`/listings/${listing._id}`);
}));

router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(async(req,res) => {
    let {id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, {$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));

module.exports = router;