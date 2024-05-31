const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middlewares.js");
const router = express.Router();
const userController = require("../controllers/user.js");

router
	.route("/signup")

	// Render signup form
	.get(userController.renderSignup)

	// Signup
	.post(saveRedirectUrl, wrapAsync(userController.signup));

router
	.route("/login")

	// Render Login page
	.get(userController.renderLogin)

	// ? passport.authenticate("strategy -> local", {options})
	.post(
		[
			saveRedirectUrl,
			passport.authenticate("local", {
				failureRedirect: "/login",
				failureFlash: "Incorrect username or password",
			}),
		],
		wrapAsync(userController.login)
	);


router.get("/logout", userController.logout);

module.exports = router;
