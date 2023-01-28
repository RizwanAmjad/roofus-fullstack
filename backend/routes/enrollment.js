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

  // check if user is already enrolled
  const enrollmentExists = await Enrollment.find({ ...enrollment }).count()
  if (enrollmentExists)
    return res
      .status(400)
      .send({ error: "User already enrolled in this OpenHouse" })

  // get count of enrolled users in the openhouse
  const usersEnrolled = await Enrollment.find({ openHouse }).count()
  // check if there is room in the openhouse
  if (usersEnrolled >= openHouse.visitorAmount) {
    return res.status(400).send({ error: "No more room in the Open House" })
  }

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

  // check if user is already enrolled
  const enrollmentExists = await Enrollment.find({ ...enrollment }).count()
  if (enrollmentExists)
    return res
      .status(400)
      .send({ error: "User already enrolled in this OpenHouse" })

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
    .sort({ _id: -1 })
    .limit(limit)
    .skip(limit * (page - 1))

  const count = await Enrollment.find().count()

  return res.send({
    data: openHouses,
    count: openHouses.length,
    totalPages: Math.ceil(count / limit),
  })
})

// get enrollment by id
router.get("/:id", async (req, res) => {
  const { id } = req.params
  // paginate the users
  const enrollment = await Enrollment.findById(id).populate([
    "openHouse",
    "user",
  ])

  if (!enrollment)
    return res.status(200).send({ error: "Enrollment not found" })

  return res.send({ data: enrollment })
})

module.exports = router
