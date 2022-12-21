const router = require('express').Router();
const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movies');
const { postMovieRule, deleteMovieRule } = require('../utils/validationRules');

router.get('/', getMovies);
router.post('/', postMovieRule, createMovie);
router.delete('/:movieId', deleteMovieRule, deleteMovie);

module.exports = router;
