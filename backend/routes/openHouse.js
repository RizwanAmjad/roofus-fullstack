const express = require("express")

const router = express.Router()

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
    const openHouse = await OpenHouse.findByIdAndRemove(id)
    if (!openHouse)
      return res.status(404).send({ error: "Open House not Found!" })
    return res.send({ data: openHouse })
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
  const { page, limit } = req.query
  // paginate the openHouse
  const openHouses = await OpenHouse.find()
    .populate("property")
    .limit(limit)
    .skip(limit * (page - 1))

  return res.send({ data: openHouses, count: openHouses.length })
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
