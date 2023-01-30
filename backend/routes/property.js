const express = require("express")

const { Enrollment } = require("../models/enrollment")
const { OpenHouse } = require("../models/openHouse")
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
    const property = await Property.findById(id)
    if (!property) return res.status(404).send({ error: "Property not Found!" })
    // delete all associated open houses
    const openHouses = await OpenHouse.find({ property: id })
    await Promise.all(
      openHouses.map(async (openHouse) => {
        await openHouse.remove()
        // delete enrollments associated with openhouse
        const enrollments = await Enrollment.find({ openHouse: openHouse._id })
        await Promise.all(
          enrollments.map(async (enrollment) => await enrollment.remove())
        )
      })
    )
    return res.send({ data: await property.remove() })
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
    .sort({ _id: -1 })
    .limit(limit)
    .skip(limit & page ? limit * (page - 1) : undefined)

  const count = await Property.find().count()

  return res.send({
    data: properties,
    count: properties.length,
    totalPages: Math.ceil(count / limit),
  })
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
