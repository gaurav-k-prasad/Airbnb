const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middlewares.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const router = express.Router({ mergeParams: true });

// ? Cloudinary ->
const { storage } = require("../cloudConfig.js");

// ? Initializing multer with the destination where to store -> don't use /uploads/
const upload = multer({ storage: storage });

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
	// care - before using req.body you have to use upload.single(...) if you don't it won't populate req.body as js can't read images but multer can so it has to go first
	.post(
		isLoggedIn,
		upload.single("listing[image]"),
		validateListing,
		wrapAsync(listingController.createListing)
	);

router
	.route("/:id")

	// Show route
	.get(wrapAsync(listingController.showListing))

	// Edit route
	.put(
		[upload.single("listing[image]"), validateListing, isOwner, isLoggedIn],
		wrapAsync(listingController.editListing)
	)

	// Delete route
	.delete([isLoggedIn, isOwner], wrapAsync(listingController.deleteListing));

module.exports = router;
