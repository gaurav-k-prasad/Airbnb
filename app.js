const express = require("express");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const path = require("path");
const Listing = require("./models/listing.js");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");
const app = express();
const port = 3000;
const MONGO_URL = "mongodb://localhost:27017/wanderlust";

// ! Using app.engine("ejs", ejsMate)
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "/views/"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));
app.use(methodOverride("_method"));

async function main() {
	await mongoose.connect(MONGO_URL);
}
main().catch((err) => {
	console.error(err);
});

const validateListing = (req, res, next) => {
	let { error } = listingSchema.validate(req.body); // - it will identify error but won't stop the program from adding it on the database
	// Validating schema by joi
	if (error) {
		let errorMsg = error.details.map((element) => element.message).join(", ")
		console.dir(error.details);
		throw new ExpressError(400, errorMsg);
	} else {
		next();
	}
};

app.get("/", (req, res) => {
	res.redirect("/listings");
});

// Index route
app.get(
	"/listings",
	wrapAsync(async (req, res, next) => {
		const allListings = await Listing.find({});
		res.render("./listings/index.ejs", { allListings });
	})
);

// ! Here new has to be written before /listings/:id coz otherwise it'll consider "new" as an id
// New form
app.get("/listings/new", (req, res) => {
	res.render("./listings/new.ejs");
});

// Show route
app.get(
	"/listings/:id",
	wrapAsync(async (req, res, next) => {
		const { id } = req.params;
		const data = await Listing.findById(id);
		res.render("./listings/show.ejs", { data });
	})
);

// Create route
app.post(
	"/listings",
	validateListing,
	wrapAsync(async (req, res, next) => {
		// ? Here we are accessing the object listing in new.ejs
		// const newListing = new Listing(req.body.listing);
		// newListing.save();

		// What if during post there is nothing like listing in body or description or title is missing but listing object is there
		const listingData = req.body.listing;

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
		res.redirect("/listings");
	})
);

// Edit route
app.get(
	"/listings/:id/edit",
	wrapAsync(async (req, res, next) => {
		const editListing = await Listing.findById(req.params.id);
		res.render("./listings/edit.ejs", { data: editListing });
	})
);

app.put(
	"/listings/:id",
	validateListing,
	wrapAsync(async (req, res, next) => {
		const { title, description, image, price, location, country } =
			req.body.listing;
		await Listing.findByIdAndUpdate(
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

		res.redirect(`/listings/${req.params.id}`);
	})
);

app.delete(
	"/listings/:id",
	wrapAsync(async (req, res, next) => {
		const deletedListing = await Listing.findByIdAndDelete(req.params.id);
		console.log(deletedListing);
		res.redirect("/listings");
	})
);

// App.all for everything get/post
app.all("*", (req, res) => {
	throw new ExpressError(404, "Page Not Found");
});

app.use((err, req, res, next) => {
	const { status = 500, message = "Something broke down" } = err;
	res.status(status).render("error.ejs", { err });
});

app.listen(port, () => {
	console.log(`App is listening on port ${port}`);
});
