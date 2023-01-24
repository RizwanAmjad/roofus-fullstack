const express = require("express")

const { Property, validatePropertyJoi } = require("../models/property")

const router = express.Router()

// create property
router.post("/", async (req, res) => {
  // get the new property info from the req body
  let property = req.body
  //valdate the property
  const error = validatePropertyJoi(property)
  if (error) return res.status(400).send({ error })

  // create and save mongoose object
  try {
    property = new Property(property)
    property = await property.save()
    return res.send({ data: property })
  } catch {
    return res.status(500).send({ error: "Server Error" })
  }
})

// delete property
router.delete("/:id", async (req, res) => {
  const { id } = req.params
  // delete the property
  try {
    const property = await Property.findByIdAndRemove(id)
    if (!property) return res.status(404).send({ error: "Property not Found!" })
    return res.send({ data: property })
  } catch (ex) {
    return res.status(500).send({ error: "Server Error" })
  }
})

// update property
router.put("/:id", async (req, res) => {
  const { id } = req.params
  let property = req.body

  const error = validatePropertyJoi(property)
  if (error) return res.status(400).send({ error })

  // update the property
  try {
    property = await Property.findByIdAndUpdate(id, property)
    if (!property) return res.status(404).send({ error: "Property not Found!" })
    return res.send({ data: property })
  } catch (ex) {
    return res.status(500).send({ error: "Server Error" })
  }
})

// get paginated properties
router.get("/", async (req, res) => {
  const { page, limit } = req.query
  // paginate the properties
  const properties = await Property.find()
    .limit(limit)
    .skip(limit * (page - 1))

  return res.send({ data: properties, count: properties.length })
})

// get property by id
router.get("/:id", async (req, res) => {
  const { id } = req.params
  // paginate the users
  const property = await Property.findById(id)

  if (!property) return res.status(200).send({ error: "Property not found" })

  return res.send({ data: property })
})

module.exports = router
