const Joi = require("joi")
const mongoose = require("mongoose")

const Property = mongoose.model(
  "Property",
  mongoose.Schema({
    address: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
  })
)

const validatePropertyJoi = (property) => {
  const schema = Joi.object({
    address: Joi.string().required().min(3).max(255).label("Address"),
    price: Joi.number().required().min(0).label("Price"),
    description: Joi.string().required().label("Description"),
  })
  const { error } = schema.validate(property)
  return error ? error.details[0].message : error
}

module.exports = { Property, validatePropertyJoi }
