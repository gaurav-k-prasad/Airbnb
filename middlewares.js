const Listing = require("./models/listing");
const { listingSchema, reviewSchema } = require("./schema");
const ExpressError = require("./utils/ExpressError");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req, res, next) => {
	// console.log(">>", req.body);
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

module.exports.isOwner = async (req, res, next) => {
	const edit = await Listing.findById(req.params.id);
	if (!edit.owner._id.equals(res.locals.currentUser._id)) {
		req.flash("error", "You are not the owner of this listing");
		return res.redirect(`/listings/${req.params.id}`);
	}
	next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
	const review = await Review.findById(req.params.reviewId);
	if (!review.author.equals(res.locals.currentUser._id)) {
		req.flash("error", "You are not the author of this review");
		return res.redirect(`/listings/${req.params.id}`);
	}
	next();
};

module.exports.validateListing = (req, res, next) => {
	let { error } = listingSchema.validate(req.body); // - it will identify error but won't stop the program from adding it on the database
	// Validating schema by joi
	if (error) {
		let errorMessage = error.details
			.map((element) => element.message)
			.join(", ");
		console.dir(error.details);
		throw new ExpressError(400, errorMessage);
	} else {
		return next();
	}
};

module.exports.validateReview = (req, res, next) => {
	let { error } = reviewSchema.validate(req.body);
	if (error) {
		let errorMessage = error.details
			.map((element) => element.message)
			.join(", ");
		throw new ExpressError(400, errorMessage);
	} else {
		next();
	}
};
