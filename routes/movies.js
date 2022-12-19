const router = require('express').Router();
const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movies');
const { getMovieRule, postMovieRule, deleteMovieRule } = require('../utils/validationRules');

router.get('/', getMovieRule, getMovies);
router.post('/', postMovieRule, createMovie);
router.delete('/:movieId', deleteMovieRule, deleteMovie);

module.exports = router;
