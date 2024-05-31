const Joi = require("joi");

// Here listingSchema has to be an object where it should have listing which should be an object required
module.exports.listingSchema = Joi.object({
	listing: Joi.object({
		title: Joi.string().required().max(50),
		description: Joi.string().required(),
		location: Joi.string().required(),
		country: Joi.string().required(),
		price: Joi.number().min(0).required(),
		image: Joi.object({
			filename: Joi.string(),
			url: Joi.string(),
		}),
	}).required(),
});

module.exports.reviewSchema = Joi.object({
	review: Joi.object({
		rating: Joi.number().min(1).max(5).required(),
		comment: Joi.string().required(),
	}).required(),
});
