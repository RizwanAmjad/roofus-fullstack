const express = require("express")
const mongoose = require("mongoose")

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/roofus"
const PORT = process.env.PORT || 3000

mongoose.set("strictQuery", false)
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to mongodb"))
  .catch(() => console.log("Couldn't connect to mongodb"))

const app = express()

app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`))
