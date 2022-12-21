const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/user');
const NotFoundError = require('../utils/errors/NotFoundError');
const ValidationError = require('../utils/errors/ValidationError');
const AlreadyRegistredError = require('../utils/errors/AlreadyRegistredError');
const { messages } = require('../utils/constants');

const { NODE_ENV = 'development', JWT_SECRET = 'dev-secret' } = process.env;

const findUserById = (res, next, id) => {
  User.findById(id)
    .orFail(new NotFoundError(messages.notFound))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError(messages.validation));
      } else {
        next(err);
      }
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  findUserById(res, next, req.user._id);
};

module.exports.updateProfile = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .orFail(new NotFoundError(messages.notFound))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ValidationError(messages.validation));
      }
      if (err.codeName === 'DuplicateKey') {
        return next(new AlreadyRegistredError(messages.alreadyRegistred));
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new ValidationError(messages.validation));
      }
      return next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((data) => {
      const user = data.toObject();
      delete user.password;
      res.send({ user });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new ValidationError(messages.validation));
      } else if (err.code === 11000) {
        next(new AlreadyRegistredError(messages.alreadyRegistred));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        // secure: true,
        httpOnly: true,
        sameSite: true,
      });
      res.send({ message: messages.authorizationSuccessful });
    })
    .catch(next);
};

module.exports.signout = (req, res) => {
  res.clearCookie('jwt').send({ message: messages.signoutSuccessful });
};
