const express = require("express")

const { User, validateUserJoi } = require("../models/user")

const router = express.Router()

// create user
router.post("/", async (req, res) => {
  // get the new user info from the req body
  let user = req.body
  //valdate the user
  const error = validateUserJoi(user)
  if (error) return res.status(400).send(error)

  // create and save mongoose object
  try {
    user = new User(user)
    user = await user.save()
    return res.send(user)
  } catch {
    return res.status(500).send("Server Error")
  }
})

module.exports = router
