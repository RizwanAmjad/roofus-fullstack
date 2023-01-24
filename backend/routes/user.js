const express = require("express")

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
    if (!user) return res.status(404).send({ error: "Painting not Found!" })
    return res.send(await user.remove())
  } catch (ex) {
    return res.status(500).send({ error: "Server Error" })
  }
})

router.get("/", async (req, res) => {
  const { page, limit } = req.query
  // paginate the users
  const users = await User.find()
    .limit(limit)
    .skip(limit * (page - 1))

  return res.send({ data: users, count: users.length })
})

module.exports = router
