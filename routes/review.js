const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");

const {
	isLoggedIn,
	validateReview,
	isReviewAuthor,
} = require("../middlewares.js");
const reviewController = require("../controllers/review.js");

// Always mergeParams to true to use params
const router = express.Router({ mergeParams: true });

// Reviews
router.post(
	"/",
	[isLoggedIn, validateReview],
	wrapAsync(reviewController.createReview)
);

// Delete Review
router.delete(
	"/:reviewId",
	[isLoggedIn, isReviewAuthor],
	wrapAsync(reviewController.deleteReview)
);

module.exports = router;
