const User = require("../models/user");

module.exports.renderLogin = (req, res) => {
	res.render("users/login.ejs");
};

module.exports.renderSignup = (req, res) => {
	res.render("users/signup.ejs");
}

module.exports.signup = async (req, res, next) => {
	let username;
	try {
		let { email, password } = req.body;
		username = req.body.username;
		const newUser = new User({ email, username });
		await User.register(newUser, password);

		req.login(newUser, (err) => {
			if (err) {
				return next(err);
			}

			req.flash("Welcome to WanderLust");

			res.redirect(
				res.locals.redirectUrl ? res.locals.redirectUrl : "/listings"
			);
		});
	} catch (error) {
		if (error.name === "UserExistsError") {
			req.flash("error", `User with username ${username} already exists`);
			res.redirect("/signup");
		} else {
			req.flash("error", error.message);
			res.redirect("/signup");
		}
	}
};

module.exports.login = async (req, res, next) => {
    req.flash("success", "Welcome to WanderLust");
    res.redirect(
        res.locals.redirectUrl ? res.locals.redirectUrl : "/listings"
    );
}

module.exports.logout = (req, res, next) => {
	req.logout((err) => {
		if (err) {
			return next(err);
		}
		req.flash("success", "Successfully Logged out");
		res.redirect("/login");
	});
}