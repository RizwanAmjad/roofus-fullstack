const Joi = require("joi")
const mongoose = require("mongoose")

const User = mongoose.model(
  "User",
  mongoose.Schema({
    name: { type: String, required: true, minLength: 3 },
  })
)

const validateUserJoi = (user) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(255).required().label("Name"),
  })
  const { error } = schema.validate(user)
  return error ? error.details[0].message : error
}

module.exports = { User, validateUserJoi }
