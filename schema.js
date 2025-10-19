const Joi = require("joi");

const listingSchema = Joi.object({
    listing:Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        location:Joi.string().required(),
        image: Joi.object({
            url: Joi.string().allow(" ",null),
        }),
        price:Joi.number().min(0).max(10000),
        country:Joi.string().required(),
    }).required()
});

module.exports = listingSchema;