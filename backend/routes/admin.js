const express = require("express")
const Joi = require("joi")

const router = express.Router()

const { Admin, validateAdminJoi } = require("../models/admin")

const validateAdminLoginJoi = (user) => {
  const schema = Joi.object({
    email: Joi.string().required().email().label("Email"),
    password: Joi.string().required().min(8).max(1024).label("Password"),
  })
  const { error } = schema.validate(user)
  return error ? error.details[0].message : error
}

// create admin
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

// authenticate admin
router.post("/auth", async (req, res) => {
  const loginAdmin = req.body
  const error = validateAdminLoginJoi(loginAdmin)

  // validate admin in request
  if (error) return res.status(400).send(error)

  // check if admin with given email exists
  const admin = await Admin.findOne({ email: loginAdmin.email })

  if (!admin) return res.status(400).send("Invalid Email or Password")

  // if admin is found then compare password
  if (!(await admin.comparePassword(loginAdmin.password)))
    return res.status(400).send("Invalid Email or Password")
  return res.send(admin.generateAuthToken())
})

module.exports = router
