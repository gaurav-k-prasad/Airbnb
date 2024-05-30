const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const User = require("../models/user.js");
const passport = require("passport");

const router = express.Router();
router.get("/signup", (req, res) => {
	res.render("users/signup.ejs");
});

router.get("/login", (req, res) => {
	res.render("users/login.ejs");
});

router.post("/signup", async (req, res, next) => {
	let username;
	try {
		let { email, password } = req.body;
		username = req.body.username;
		const newUser = new User({ email, username });
		await User.register(newUser, password);
		console.log(newUser);

		passport.authenticate("local")(req, res, function () {
			req.flash("success", "Successfully registered");
			res.redirect("/listings");
		});

		// res.redirect("/listings");
	} catch (error) {
		if (error.name === "UserExistsError") {
			req.flash("error", `User with username ${username} already exists`);
			res.redirect("/signup");
		} else {
			req.flash("error", error.message);
			res.redirect("/signup");
		}
	}
});

// ? passport.authenticate("strategy -> local", {options})
router.post(
	"/login",
	passport.authenticate("local", {
		failureRedirect: "/login",
		failureFlash: "Incorrect username or password",
	}),
	wrapAsync(async (req, res, next) => {
		req.flash("success", "Welcome to WanderLust");
		res.redirect("/listings");
	})
);

router.get("/logout", (req, res, next) => {
	req.logout((err) => {
		if (err) {
			return next(err);
		}
		req.flash("success", "Successfully Logged out");
		res.redirect("/login");
	});
});

module.exports = router;
