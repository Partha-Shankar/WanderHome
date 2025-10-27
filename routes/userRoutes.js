const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const userController = require("../controllers/userController.js");
const router = express.Router({mergeParams:true});
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
 
router
  .route("/signup")
  .get(userController.getSignup)
  .post(wrapAsync(userController.postSignup));

router
  .route("/login")
  .get(userController.getLogin)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    wrapAsync(userController.postLogin)
  );

router.get("/logout", userController.getlogout);

module.exports = router;