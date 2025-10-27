const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const reviewController = require("../controllers/reviewController.js");
const router = express.Router({mergeParams:true});
const { isLoggedIn, validateReview, isReviewAuthor} = require("../middleware.js");

router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.postReview));

router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;