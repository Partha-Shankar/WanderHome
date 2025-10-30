const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const router = express.Router({mergeParams:true});
const { isLoggedIn, validatelisting, isOwner } = require("../middleware.js");
const listingController = require("../controllers/listingController.js");

//cloud setup
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const parser = multer({ storage: storage });

router.get("/new", isLoggedIn, wrapAsync(listingController.getNewListing));
router.get("/:id/edit",isLoggedIn, isOwner, wrapAsync(listingController.getEditListing));

router
  .route("/")
  .get(wrapAsync(listingController.getAllListings))
  .post(isLoggedIn, validatelisting, parser.single('listing[image]'), wrapAsync(listingController.postNewListing));


router
  .route("/:id")
  .get(wrapAsync(listingController.getIndividualListing))
  .put(isLoggedIn, isOwner, validatelisting, parser.single('listing[image]'), wrapAsync(listingController.putEditListing))
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

module.exports = router;