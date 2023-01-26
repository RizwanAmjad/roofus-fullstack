const cors = require("cors")
const express = require("express")
const mongoose = require("mongoose")

// routes
const admin = require("./routes/admin")
const enrollment = require("./routes/enrollment")
const openHouse = require("./routes/openHouse")
const property = require("./routes/property")
const user = require("./routes/user")

const adminAuth = require("./middlewares/authAdmin")

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/roofus"
const PORT = process.env.PORT || 3000

mongoose.set("strictQuery", false)
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to mongodb"))
  .catch(() => console.log("Couldn't connect to mongodb"))

const app = express()

app.use(express.json())
app.use(cors())

app.use("/api/admin", admin)
app.use("/api/enrollment", adminAuth, enrollment)
app.use("/api/open-house", adminAuth, openHouse)
app.use("/api/property", adminAuth, property)
app.use("/api/user", adminAuth, user)

app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`))
