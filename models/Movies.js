const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    desc: { type: String },
    backdrop: { type: String },
    imgTitle: { type: String, default: '' },
    poster: { type: String },
    trailer: { type: String },
    video: { type: String },
    year: { type: String },
    rating: { type: String },
    genre: { type: Array },
    popularity: { type: String },
    isSeries: { type: Boolean, default: false },
  },
  { timestamps: true }
)

module.exports = mongoose.model("Movie", MovieSchema);
