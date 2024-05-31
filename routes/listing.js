const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middlewares.js");
const listingController = require("../controllers/listing.js");
const router = express.Router({ mergeParams: true });

// ! Here new has to be written before /listings/:id coz otherwise it'll consider "new" as an id
// Get New Listing
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Get Edit route
router.get(
	"/:id/edit",
	[isLoggedIn, isOwner],
	wrapAsync(listingController.renderEditForm)
);

router
	.route("/")

	// All Listings
	.get(wrapAsync(listingController.index))

	// Create new listing
	.post(
		[isLoggedIn, validateListing],
		wrapAsync(listingController.createListing)
	);

router
	.route("/:id")

	// Show route
	.get(wrapAsync(listingController.showListing))

	// Edit route
	.put(
		[validateListing, isOwner, isLoggedIn],
		wrapAsync(listingController.editListing)
	)

	// Delete route
	.delete([isLoggedIn, isOwner], wrapAsync(listingController.deleteListing));


module.exports = router;
