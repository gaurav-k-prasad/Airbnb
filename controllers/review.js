const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async (req, res, next) => {
	const listing = await Listing.findById(req.params.id);
	const newReview = new Review({
		...req.body.review,
		author: req.user._id,
	});
	listing.reviews.push(newReview);
	await newReview.save();
	await listing.save();
	req.flash("success", "Review Added");
	res.redirect(`/listings/${req.params.id}#review`);
};

module.exports.deleteReview = async (req, res, next) => {
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
};
