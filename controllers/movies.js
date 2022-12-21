const mongoose = require('mongoose');
const Movie = require('../models/movie');
const ForbiddenAccessError = require('../utils/errors/ForbiddenAccessError');
const NotFoundError = require('../utils/errors/NotFoundError');
const ValidationError = require('../utils/errors/ValidationError');

const { messages } = require('../utils/constants');

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new ValidationError(messages.validation));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  const userId = req.user._id;
  Movie.findById(movieId)
    .orFail(new NotFoundError(messages.notFound))
    .then((movie) => {
      if (movie.owner.toString() !== userId) {
        throw new ForbiddenAccessError(messages.forbidden);
      }
      res.send({ movie });
      movie.remove();
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError(messages.validation));
      } else {
        next(err);
      }
    });
};
