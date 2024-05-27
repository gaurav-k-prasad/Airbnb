const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
	title: {
		required: true,
		type: String,
	},
	description: {
		default: "",
		type: String,
	},
	image: {
		filename: {
			type: String,
			default: "listingimage",
		},
		url: {
			default:
				"https://media.istockphoto.com/id/1396814518/vector/image-coming-soon-no-photo-no-thumbnail-image-available-vector-illustration.jpg?s=612x612&w=0&k=20&c=hnh2OZgQGhf0b46-J2z7aHbIWwq8HNlSDaNp2wn_iko=",
			type: String,
			// ? v is the value of image
			set: (v) => {
				return v === ""
					? "https://media.istockphoto.com/id/1396814518/vector/image-coming-soon-no-photo-no-thumbnail-image-available-vector-illustration.jpg?s=612x612&w=0&k=20&c=hnh2OZgQGhf0b46-J2z7aHbIWwq8HNlSDaNp2wn_iko="
					: v;
			},
		},
	},
	price: {
		type: Number,
		min: 300,
		required: true,
	},
	location: {
		type: String,
		required: true,
	},
	country: {
		type: String,
		required: true,
	},
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;