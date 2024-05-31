module.exports.isLoggedIn = (req, res, next) => {
	if (!req.isAuthenticated()) {
		req.session.redirectUrl = req.originalUrl;
		req.flash("error", "You must be logged in");
		return res.redirect("/login");
	}
	return next();
};

// ? As soon as login is done passport deletes all req.session but it can't delete locals so if we had any urls user was trying to access before logging in we can access it with locals
module.exports.saveRedirectUrl = (req, res, next) => {
	if (req.session.redirectUrl) {
		res.locals.redirectUrl = req.session.redirectUrl;
	}
	next();
};
