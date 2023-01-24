const express = require("express")

const router = express.Router()

const { Enrollment, validateEnrollmentJoi } = require("../models/enrollment")
const { OpenHouse } = require("../models/openHouse")
const { User } = require("../models/user")

// create enrollment
router.post("/", async (req, res) => {
  // get the new openHouse info from the req body
  let enrollment = req.body
  //valdate the openHouse
  const error = validateEnrollmentJoi(enrollment)
  if (error) return res.status(400).send({ error })

  // check if openHouse exists
  const openHouse = await OpenHouse.findById(enrollment.openHouse)
  if (!openHouse) return res.status(404).send({ error: "Open House not found" })

  // check if user exists
  const user = await User.findById(enrollment.user)
  if (!user) return res.status(404).send({ error: "User not found" })

  // create and save mongoose object
  try {
    enrollment = new Enrollment(enrollment)
    enrollment = await enrollment.save()
    return res.send({ data: enrollment })
  } catch {
    return res.status(500).send({ error: "Server Error" })
  }
})

// delete enrollment
router.delete("/:id", async (req, res) => {
  const { id } = req.params
  // delete the enrollment
  try {
    const enrollment = await Enrollment.findByIdAndRemove(id)
    if (!enrollment)
      return res.status(404).send({ error: "Enrollment not Found" })
    return res.send({ data: enrollment })
  } catch (ex) {
    return res.status(500).send({ error: "Server Error" })
  }
})

// update enrollment
router.put("/:id", async (req, res) => {
  const { id } = req.params
  let enrollment = req.body

  const error = validateEnrollmentJoi(enrollment)
  if (error) return res.status(400).send({ error })

  // check if openHouse exists
  const openHouse = await OpenHouse.findById(enrollment.openHouse)
  if (!openHouse) return res.status(404).send({ error: "Open House not found" })

  // check if user exists
  const user = await User.findById(enrollment.user)
  if (!user) return res.status(404).send({ error: "User not found" })

  // update the enrollment
  try {
    enrollment = await Enrollment.findByIdAndUpdate(id, enrollment)
    if (!enrollment)
      return res.status(404).send({ error: "Enrollment not Found!" })
    return res.send({ data: enrollment })
  } catch (ex) {
    return res.status(500).send({ error: "Server Error" })
  }
})

// get paginated enrollments
router.get("/", async (req, res) => {
  const { page, limit } = req.query
  // paginate the enrollments
  const openHouses = await Enrollment.find()
    .populate(["openHouse", "user"])
    .limit(limit)
    .skip(limit * (page - 1))

  return res.send({ data: openHouses, count: openHouses.length })
})

module.exports = router
