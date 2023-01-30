const express = require("express")

const router = express.Router()

const { Enrollment } = require("../models/enrollment")
const { OpenHouse, validateOpenHouseJoi } = require("../models/openHouse")
const { Property } = require("../models/property")

// create openHouse
router.post("/", async (req, res) => {
  // get the new openHouse info from the req body
  let openHouse = req.body
  //valdate the openHouse
  const error = validateOpenHouseJoi(openHouse)
  if (error) return res.status(400).send({ error })

  // check if property exists
  const property = await Property.findById(openHouse.property)
  if (!property) return res.status(404).send({ error: "Property not found" })

  // create and save mongoose object
  try {
    openHouse = new OpenHouse(openHouse)
    openHouse = await openHouse.save()
    return res.send({ data: openHouse })
  } catch {
    return res.status(500).send({ error: "Server Error" })
  }
})

// delete openHouse
router.delete("/:id", async (req, res) => {
  const { id } = req.params
  // delete the openHouse
  try {
    const openHouse = await OpenHouse.findById(id)
    if (!openHouse)
      return res.status(404).send({ error: "Open House not Found!" })

    // delete enrollments associated with openhouse
    const enrollments = await Enrollment.find({ openHouse: id })
    await Promise.all(
      enrollments.map(async (enrollment) => await enrollment.remove())
    )
    return res.send({ data: await openHouse.remove() })
  } catch (ex) {
    return res.status(500).send({ error: "Server Error" })
  }
})

// update openHouse
router.put("/:id", async (req, res) => {
  const { id } = req.params
  let openHouse = req.body

  const error = validateOpenHouseJoi(openHouse)
  if (error) return res.status(400).send({ error })

  // check if property exists
  const property = await Property.findById(openHouse.property)
  if (!property) return res.status(404).send({ error: "Property not found" })

  // check if new visitorAmount is greater than already enrolled visitors
  const enrolledVisitorAmount = await Enrollment.find({ openHouse: id }).count()

  if (enrolledVisitorAmount > openHouse.visitorAmount) {
    return res.status(400).send({
      error: `New visitor amount should be greater than already enrolled vistors i-e ${enrolledVisitorAmount}`,
    })
  }
  // update the openHouse
  try {
    openHouse = await OpenHouse.findByIdAndUpdate(id, openHouse)
    if (!openHouse)
      return res.status(404).send({ error: "Open House not Found!" })
    return res.send({ data: openHouse })
  } catch (ex) {
    return res.status(500).send({ error: "Server Error" })
  }
})

// get paginated openHouse
router.get("/", async (req, res) => {
  const { page, limit, property, upcoming } = req.query
  let filters = {}

  if (property) filters = { ...filters, property }
  if (upcoming) {
    const today = new Date()
    today.setHours(0)
    today.setMinutes(0)
    today.setSeconds(0)
    today.setMilliseconds(0)
    filters = { ...filters, ...{ startDate: { $gte: today } } }
  }
  // paginate the openHouse
  const openHouses = await OpenHouse.find(filters)
    .populate("property")
    .sort({ _id: -1 })
    .limit(limit)
    .skip(limit & page ? limit * (page - 1) : undefined)

  const count = await OpenHouse.find().count()

  return res.send({
    data: openHouses,
    count: openHouses.length,
    totalPages: Math.ceil(count / limit),
  })
})

// get openhouse by id
router.get("/:id", async (req, res) => {
  const { id } = req.params
  // paginate the users
  const openHouse = await OpenHouse.findById(id).populate(["property"])

  if (!openHouse) return res.status(200).send({ error: "Open House not found" })

  return res.send({ data: openHouse })
})

module.exports = router
