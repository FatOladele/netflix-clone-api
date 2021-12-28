const mongoose = require("mongoose");

const GenreSchema = new mongoose.Schema(
  {
    id: { type: Number },
    name: { type: String }
  },
  { timestamps: true }
)

module.exports = {
  SeriesGenre: mongoose.model('SeriesGenre', GenreSchema),
  MoviesGenre: mongoose.model('MovieGenre', GenreSchema)
}