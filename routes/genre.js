const router = require("express").Router()
const { SeriesGenre, MoviesGenre } = require("../models/Genre")

router.get("/", async (req, res) => {

  try {
    const series = await SeriesGenre.find({}, { id: 1, name: 1, _id: 0 })
    const movies = await MoviesGenre.find({}, { id: 1, name: 1, _id: 0 })
    res.status(200).json({ series, movies})
  } catch (err) {
    res.status(500).json(err);
  }
});



module.exports = router;