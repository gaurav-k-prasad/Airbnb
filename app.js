const express = require("express");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const path = require("path");
const Listing = require("./models/listing.js");
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

app.get("/", (req, res) => {
	res.send("I am root!");
});

// Index route
app.get("/listings", async (req, res) => {
	const allListings = await Listing.find({});
	res.render("./listings/index.ejs", { allListings });
});

// ! Here new has to be written before /listings/:id coz otherwise it'll consider "new" as an id
// New form
app.get("/listings/new", (req, res) => {
	res.render("./listings/new.ejs");
});

// Show route
app.get("/listings/:id", async (req, res) => {
	const { id } = req.params;
	const data = await Listing.findById(id);
	res.render("./listings/show.ejs", { data });
});

// Create route
app.post("/listings", async (req, res) => {
	// ? Here we are accessing the object listing in new.ejs
	// const newListing = new Listing(req.body.listing);
	// newListing.save();

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
});

// Edit route
app.get("/listings/:id/edit", async (req, res) => {
	const editListing = await Listing.findById(req.params.id);
	res.render("./listings/edit.ejs", { data: editListing });
});

app.put("/listings/:id", async (req, res) => {
	const { title, description, image, price, location, country } =
		req.body.listing;
	await Listing.findByIdAndUpdate(req.params.id, {
		title: title,
		description: description,
		image: { filename: "filename", url: image },
		price: price,
		location: location,
		country: country,
	});

	res.redirect(`/listings/${req.params.id}`);
});

app.delete("/listings/:id", async (req, res) => {
	const deletedListing = await Listing.findByIdAndDelete(req.params.id);
	console.log(deletedListing);
	res.redirect("/listings");
});

// app.get("/testListing", async (req, res) => {
// 	let sampleListing = new Listing({
// 		title: "New House",
// 		description: "This is my new house by the beach",
// 		price: 1200,
// 		location: "Nashik, Maharashtra",
// 		country: "India",
// 	});

// 	await sampleListing.save();
// 	res.send("Done");
// });

app.listen(port, () => {
	console.log(`App is listening on port ${port}`);
});
