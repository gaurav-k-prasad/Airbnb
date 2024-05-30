const express = require("express");
const { listingSchema } = require("../schema.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const { isLoggedIn } = require("../middlewares.js");

const router = express.Router({ mergeParams: true });

const validateListing = (req, res, next) => {
	let { error } = listingSchema.validate(req.body); // - it will identify error but won't stop the program from adding it on the database
	// Validating schema by joi
	if (error) {
		let errorMessage = error.details
			.map((element) => element.message)
			.join(", ");
		console.dir(error.details);
		throw new ExpressError(400, errorMessage);
	} else {
		next();
	}
};

// All Listings
router.get(
	"/",
	wrapAsync(async (req, res, next) => {
		const allListings = await Listing.find({});
		res.render("./listings/index.ejs", { allListings });
	})
);

// ! Here new has to be written before /listings/:id coz otherwise it'll consider "new" as an id
// Get New Listing 
router.get("/new", isLoggedIn, (req, res) => {
	res.render("./listings/new.ejs");
});

// Show route
router.get(
	"/:id",
	wrapAsync(async (req, res, next) => {
		const { id } = req.params;
		const data = await Listing.findById(id).populate("reviews");
		if (!data) {
			req.flash("error", "Listing does not exist!");
			res.redirect("/listings");
		}
		console.log(data);
		res.render("./listings/show.ejs", { data });
	})
);

// Create route
router.post(
	"/",
	[isLoggedIn, validateListing],
	wrapAsync(async (req, res, next) => {
		// ? Here we are accessing the object listing in new.ejs
		// const newListing = new Listing(req.body.listing);
		// newListing.save();

		// What if during post there is nothing like listing in body or description or title is missing but listing object is there

		// ? We can use this method but very tedious
		// if (!req.body.listing) {
		// 	throw new ExpressError(400, "Please send valid data for listing");
		// } else if (!listingData.title) {
		// 	throw new ExpressError(400, "Title missing");
		// } else if (!listingData.description) {
		// 	throw new ExpressError(400, "Description missing");
		// } else if (!listingData.location) {
		// 	throw new ExpressError(400, "Location missing");
		// } else if (!listingData.country) {
		// 	throw new ExpressError(400, "Country missing");
		// } else if (!listingData.price) {
		// 	throw new ExpressError(400, "Price missing");
		// }
		const { title, description, image, price, location, country } =
			req.body.listing;

		const newListing = new Listing({
			title: title,
			description: description,
			image: { filename: "filename", url: image },
			price: price,
			location: location,
			country: country,
		});
		await newListing.save();
		req.flash("success", "New Listing Created");

		res.redirect("/listings");
	})
);

// Get Edit route
router.get(
	"/:id/edit",
	isLoggedIn,
	wrapAsync(async (req, res, next) => {
		const editListing = await Listing.findById(req.params.id);
		if (!editListing) {
			req.flash("error", "Listing does not exist!");
			res.redirect("/listings");
		} else {
			res.render("./listings/edit.ejs", { data: editListing });
		}
	})
);

// Edit route
router.put(
	"/:id",
	[validateListing, isLoggedIn],
	wrapAsync(async (req, res, next) => {
		const { title, description, image, price, location, country } =
			req.body.listing;
		const editListing = await Listing.findByIdAndUpdate(
			req.params.id,
			{
				title: title,
				description: description,
				image: { filename: "filename", url: image },
				price: price,
				location: location,
				country: country,
			},
			{ runValidators: true }
		);

		req.flash("success", "Edits Saved");
		res.redirect(`/listings/${req.params.id}`);
	})
);

// Delete route
router.delete(
	"/:id",
	isLoggedIn,
	wrapAsync(async (req, res, next) => {
		const deletedListing = await Listing.findByIdAndDelete(req.params.id);
		req.flash("success", "Listing Deleted");
		console.log(deletedListing);
		res.redirect("/listings");
	})
);

module.exports = router;
