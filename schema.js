const Joi = require("joi")

// Here listingSchema has to be an object where it should have listing which should be an object required
module.exports.listingSchema = Joi.object({
    listing : Joi.object({
        title: Joi.string().required().max(50),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().min(0).required(),
        image: Joi.string().allow("", null)
    }).required()
})

