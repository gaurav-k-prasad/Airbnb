// ============================== Require ===============================
const ejsMate = require("ejs-mate");
const express = require("express");
const ExpressError = require("./utils/ExpressError.js");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
// * Environment Variables ------------------
// We require dotenv and run config function
if (process.env.NODE_ENV != "production") {
	require("dotenv").config();
}
// * ----------------------------------------

// * Routes ---------------------------------
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const usersRouter = require("./routes/user.js");
// * ----------------------------------------

// * Authentication require -----------------
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
// * ----------------------------------------
// =======================================================================

// ============================== Constants ==============================
const app = express();
const port = 3000;
const MONGO_URL = "mongodb://localhost:27017/wanderlust";
const sessionOptions = {
	secret: "SecretKey",
	saveUninitialized: true,
	resave: false,
	// the session id age and expire date can be set in cookie option in session
	cookie: {
		expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
		// maxAge is most important, All set in ms
		maxAge: 7 * 24 * 60 * 60 * 1000,
		httpOnly: true,
	},
};

// =======================================================================

// ============================== Middlewares ============================
// ! Using app.engine("ejs", ejsMate)
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views/"));
app.use(express.json());
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// care first use flash and session and then routes from routers
// care passport uses session so we don't have to authenticate from other tabs
app.use(session(sessionOptions));
app.use(flash());

// * Authenticate ------------------------
app.use(passport.initialize()); // -> Initializes passport
app.use(passport.session()); // Used to identify if the same user is requesting or someone else
passport.use(new LocalStrategy(User.authenticate())); // all the request should pass through local strategy which will be authenticated by method .authenticate()

// Serializing user in the session
passport.serializeUser(User.serializeUser());
// Removing user from the session
passport.deserializeUser(User.deserializeUser());
// * -------------------------------------

app.use((req, res, next) => {
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");
	res.locals.currentUser = req.user;
	next();
});
// =======================================================================

// ============================== Mongo Connect ==========================
async function main() {
	await mongoose.connect(MONGO_URL);
}
main().catch((err) => {
	console.error(err);
});
// =======================================================================

// =============================== Routers ===============================
// ? parent route
app.use("/listings", listingsRouter);
// care - here id won't be passed in reviews until we use express.Router({mergeParams: true}) in review.js coz the request params is not being passed in reviews.js in router with merge params it is passing
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", usersRouter);
// =======================================================================

app.get("/", (req, res) => {
	res.redirect("/listings");
});

// App.all for everything get/post
app.all("*", (req, res) => {
	throw new ExpressError(404, "Page Not Found");
});

app.use((err, req, res, next) => {
	const { status = 500, message = "Something broke down" } = err;
	console.log(err);
	res.status(status).render("error.ejs", { err });
});

app.listen(port, () => {
	console.log(`App is listening on port ${port}`);
});
