const express = require("express")
const mongoose = require("mongoose")

// routes
const admin = require("./routes/admin")
const openHouse = require("./routes/openHouse")
const property = require("./routes/property")
const user = require("./routes/user")

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

app.use("/api/admin", admin)
app.use("/api/open-house", openHouse)
app.use("/api/property", property)
app.use("/api/user", user)

app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`))
