const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geoCodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res, next) => {
	const allListings = await Listing.find({});
	res.render("./listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
	res.render("./listings/new.ejs");
};

module.exports.showListing = async (req, res, next) => {
	const { id } = req.params;
	const data = await Listing.findById(id)
		// Nesting populate
		.populate({ path: "reviews", populate: "author" })
		.populate("owner");
	data.reviews = data.reviews.map((element) => {
		return element.populate("author");
	});
	if (!data) {
		req.flash("error", "Listing does not exist!");
		res.redirect("/listings");
	}
	res.render("./listings/show.ejs", { data });
};

module.exports.createListing = async (req, res, next) => {
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

	let coordinate = await geoCodingClient
		.forwardGeocode({
			query: req.body.listing.location + ", " + req.body.listing.country,
			limit: 1,
		})
		.send();

	if (!coordinate.body.features[0]){
		req.flash("error", "Please enter exact location");
		return res.redirect("/listings/new");
	}

	let listing = req.body.listing;
	listing.image = { filename: req.file.filename, url: req.file.path };
	const newListing = new Listing(listing);
	newListing.owner = req.user._id;
	newListing.geometry = coordinate.body.features[0].geometry;
	await newListing.save();
	req.flash("success", "New Listing Created");
	res.redirect(`/listings/${newListing._id}`);
};

module.exports.renderEditForm = async (req, res, next) => {
	const editListing = await Listing.findById(req.params.id);

	if (!editListing) {
		req.flash("error", "Listing does not exist!");
		res.redirect("/listings");
	} else {
		let currImage = editListing.image.url;
		// Reducing the resolution of image
		currImage = currImage.replace("/upload", "/upload/h_250,w_300");
		res.render("./listings/edit.ejs", {
			data: editListing,
			currImage: currImage,
		});
	}
};

module.exports.editListing = async (req, res, next) => {
	const updateListing = req.body.listing;

	// what if user did not edit image
	if (req.file) {
		updateListing.image = {
			filename: req.file.filename,
			url: req.file.path,
		};
	}

	console.log(updateListing, req.file);

	await Listing.findByIdAndUpdate(req.params.id, updateListing, {
		runValidators: true,
	});

	req.flash("success", "Edits Saved");
	res.redirect(`/listings/${req.params.id}`);
};

module.exports.deleteListing = async (req, res, next) => {
	const deletedListing = await Listing.findByIdAndDelete(req.params.id);
	req.flash("success", "Listing Deleted");
	res.redirect("/listings");
};
