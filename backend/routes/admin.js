const express = require("express")
const router = express.Router()

const { Admin, validateAdminJoi } = require("../models/admin")

router.post("/", async (req, res) => {
  let admin = req.body
  const error = validateAdminJoi(admin)
  // validate admin in request
  if (error) return res.status(400).send(error)

  const isAlreadyRegistered = await Admin.findOne({ email: admin.email })
  if (isAlreadyRegistered)
    return res.status(400).send("Admin already Registered.")

  // create the new admin
  admin = new Admin(admin)
  try {
    // save the admin into database
    admin = await admin.save()
    return res.send(admin.generateAuthToken())
  } catch {
    return res.status(500).send("Server Error")
  }
})

module.exports = router
