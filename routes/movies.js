const router = require("express").Router()
const Movie = require("../models/Movies")
function shuffle(array) {
  var m = array.length, t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}
router.get("/featured", async (req, res) => {
  const type = req.query.type;
  let movie;

  try {
    if (type && type === "series") {
      movie = await Movie.findOne({ isSeries: true, imgTitle: { $ne: "" } })
    } else {
      movie = await Movie.findOne({ isSeries: false, imgTitle: { $ne: ""} })
    }
    res.status(200).json(movie)
  } catch (err) {
    res.status(500).json(err)
  }
})

router.get("/randomlist", async (req, res) => {
  try {
    const type = req.query.type
    const genre = req.query.genre
    var filterObj = {}
    if (type) filterObj.isSeries = (type === 'series') ? true : false
    if (genre) filterObj.genre = parseInt(genre)
    let newMovies = await Movie.aggregate([
      { $match: filterObj },
      {
        $project: {
          year: {
            $dateFromString: {
              dateString: '$year',
              format: "%Y-%m-%d"
            }
          },
          title: 1,
          desc: 1,
          backdrop: 1,
          imgTitle: 1,
          poster: 1,
          rating: 1,
          genre: 1,
          isSeries: 1,
          popularity: 1
        }
      },
      { $sort: { year: -1 } },
      { $limit: 30 }
    ])
    newMovies = shuffle(newMovies)
    newMovies = newMovies.slice(0, 10)
    let popularMovies = await Movie.aggregate([
      { $match: filterObj },
      { $sort: { popularity: -1 } },
      { $limit: 30 }
    ])
    popularMovies = shuffle(popularMovies)
    popularMovies = popularMovies.slice(0, 10)
    topMovies = await Movie.aggregate([
      { $match: filterObj },
      { $sort: { rating: -1 } },
      { $limit: 30 }
    ])
    topMovies = shuffle(topMovies)
    topMovies = topMovies.slice(0, 10)

    const movieList = {
      New: newMovies,
      Top: topMovies,
      Popular: popularMovies
    }
    return res.status(200).json(movieList)
  } catch (err) {
    return res.status(500).json(err)
  }
})

module.exports = router;
