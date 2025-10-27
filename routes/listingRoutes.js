const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const router = express.Router({mergeParams:true});
const { isLoggedIn, validatelisting, isOwner } = require("../middleware.js");
const listingController = require("../controllers/listingController.js");

router
  .route("/")
  .get(wrapAsync(listingController.getAllListings))
  .post(isLoggedIn, validatelisting, wrapAsync(listingController.postNewListing));


router.get("/new", isLoggedIn, wrapAsync(listingController.getNewListing));

router
  .route("/:id")
  .get(wrapAsync(listingController.getIndividualListing))
  .put(isLoggedIn, isOwner, validatelisting, wrapAsync(listingController.putEditListing))
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

router.get("/:id/edit",isLoggedIn, isOwner, wrapAsync(listingController.getEditListing));

module.exports = router;