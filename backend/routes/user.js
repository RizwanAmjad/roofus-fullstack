const express = require("express")

const { Enrollment } = require("../models/enrollment")
const { User, validateUserJoi } = require("../models/user")

const router = express.Router()

// create user
router.post("/", async (req, res) => {
  // get the new user info from the req body
  let user = req.body
  //valdate the user
  const error = validateUserJoi(user)
  if (error) return res.status(400).send({ error })

  // create and save mongoose object
  try {
    user = new User(user)
    user = await user.save()
    return res.send({ data: user })
  } catch {
    return res.status(500).send({ error: "Server Error" })
  }
})

// delete user
router.delete("/:id", async (req, res) => {
  const { id } = req.params
  // delete the user
  try {
    const user = await User.findById(id)
    if (!user) return res.status(404).send({ error: "User not Found!" })
    // delete enrollments associated with user
    const enrollments = await Enrollment.find({ user: id })
    await Promise.all(
      enrollments.map(async (enrollment) => await enrollment.remove())
    )
    return res.send({ data: await user.remove() })
  } catch (ex) {
    return res.status(500).send({ error: "Server Error" })
  }
})

// update user
router.put("/:id", async (req, res) => {
  const { id } = req.params
  let user = req.body

  const error = validateUserJoi(user)
  if (error) return res.status(400).send({ error })

  // update the user
  try {
    user = await User.findByIdAndUpdate(id, user)
    if (!user) return res.status(404).send({ error: "User not Found!" })
    return res.send({ data: user })
  } catch (ex) {
    return res.status(500).send({ error: "Server Error" })
  }
})

// get paginated users
router.get("/", async (req, res) => {
  const { page, limit } = req.query
  // paginate the users
  const users = await User.find()
    .sort({ _id: -1 })
    .limit(limit)
    .skip(limit * (page - 1))

  const count = await User.find().count()

  return res.send({
    data: users,
    count: users.length,
    totalPages: Math.ceil(count / limit),
  })
})

// get user by id
router.get("/:id", async (req, res) => {
  const { id } = req.params
  // paginate the users
  const user = await User.findById(id)

  if (!user) return res.status(200).send({ error: "User not found" })

  return res.send({ data: user })
})

module.exports = router
