const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://localhost:27017/wanderlust";
async function main() {
	await mongoose.connect(MONGO_URL);
}
main().catch((err) => {
	console.error(err);
});

const initDb = async () => {
	await Listing.deleteMany({});
	await Listing.insertMany(initData.data);
	console.log("Data was initialized");
};

initDb();
