const express = require("express");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const path = require("path");
const ExpressError = require("./utils/ExpressError.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
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


// ? parent route
app.use("/listings", listings)
// care - here id won't be passed in reviews until we use express.Router({mergeParams: true}) in review.js coz the request params is not being passed in reviews.js in router with merge params it is passing
app.use("/listings/:id/reviews", reviews)

app.get("/", (req, res) => {
	res.redirect("/listings");
});

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
