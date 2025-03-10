const mongoose = require("mongoose");
const Review = require("./review.js");
const User = require("./user.js");

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
		min: 0,
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
	reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "User",
	},
	geometry: {
		type: {
			type: String,
			enum: ["Point"],
			// required: true,
		},
		coordinates: {
			type: [Number],
			// required: true,
		},
	},
});

// In case the listing is deleted so deleting the reviews
listingSchema.post("findOneAndDelete", async (listing) => {
	if (listing) {
		await Review.deleteMany({ _id: { $in: listing.reviews } });
	}
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
