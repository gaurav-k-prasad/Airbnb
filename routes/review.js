const express = require("express");
const { reviewSchema } = require("../schema.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const { isLoggedIn } = require("../middlewares.js");

// Always mergeParams to true to use params
const router = express.Router({ mergeParams: true });

const validateReview = (req, res, next) => {
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

// Reviews
router.post(
	"/",
	[isLoggedIn, validateReview],
	wrapAsync(async (req, res, next) => {
		const listing = await Listing.findById(req.params.id);
		const newReview = new Review(req.body.review);
		listing.reviews.push(newReview);

		await newReview.save();
		await listing.save();
		req.flash("success", "Review Added");
		res.redirect(`/listings/${req.params.id}#review`);
	})
);

// Delete Review
router.delete(
	"/:reviewId",
	isLoggedIn,
	wrapAsync(async (req, res, next) => {
		const { id, reviewId } = req.params;
		await Review.findByIdAndDelete(reviewId);
		// ? $pull operator removes all values of array which matches

		await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
		// or
		// const listing = await Listing.findById(id);
		// listing.reviews = listing.reviews.filter((element) => {
		// 	return reviewId != element;
		// });
		req.flash("success", "Review Deleted");
		res.redirect(`/listings/${id}`);
	})
);

module.exports = router;
