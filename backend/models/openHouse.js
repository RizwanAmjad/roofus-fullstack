const Joi = require("joi")
const mongoose = require("mongoose")

const OpenHouse = mongoose.model(
  "OpenHouse",
  mongoose.Schema({
    property: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Property",
    },
    visitorAmount: { type: Number, required: true, min: 0 },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  })
)

const validateOpenHouseJoi = (openHouse) => {
  const schema = Joi.object({
    property: Joi.string()
      .required()
      .regex(/^[0-9a-fA-F]{24}$/)
      .message("Property must a valid Object Id"),
    visitorAmount: Joi.number().required().min(0).label("Visitor Amount"),
    startDate: Joi.date().required().min(0).label("Start Date"),
    endDate: Joi.date().required().min(0).label("End Date"),
  })
  const { error } = schema.validate(openHouse)
  return error ? error.details[0].message : error
}

module.exports = { OpenHouse, validateOpenHouseJoi }
