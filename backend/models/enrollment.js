const Joi = require("joi")
const mongoose = require("mongoose")

const Enrollment = mongoose.model(
  "Enrollment",
  mongoose.Schema({
    openHouse: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "OpenHouse",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    date: { type: Date, default: Date.now },
  })
)

const validateEnrollmentJoi = (enrollment) => {
  const schema = Joi.object({
    openHouse: Joi.string()
      .required()
      .regex(/^[0-9a-fA-F]{24}$/)
      .message("Open House must a valid Object Id"),
    user: Joi.string()
      .required()
      .regex(/^[0-9a-fA-F]{24}$/)
      .message("User must a valid Object Id"),
  })
  const { error } = schema.validate(enrollment)
  return error ? error.details[0].message : error
}

module.exports = { Enrollment, validateEnrollmentJoi }
