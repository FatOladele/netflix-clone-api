const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const authRoute = require("./routes/auth")
const genreRoute = require("./routes/genre")
const moviesRoute = require("./routes/movies")
const verify = require("./middleware/verifyToken")
const cors = require("cors")

dotenv.config();
const app = express();

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("DB Connection Successfull"))
  .catch((err) => {
    console.error(err);
  });
app.use(express.json());
app.use(cors())

app.use("/api/auth", authRoute)
app.use("/api/genre", genreRoute)
app.use("/api/movies",verify, moviesRoute)
app.get("/", (req, res) => {
  return res.json({msg: "hello"})
})
app.listen(5000, () => {
  console.log("Server running on 5000")
})