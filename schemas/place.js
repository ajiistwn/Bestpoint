const Joi = require("joi")
const { Schema } = require("mongoose")

module.exports.placeSchema = Joi.object({
    title: Joi.string().required(),
    location: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().min(0).required(),
    image: Joi.string().required(),
})