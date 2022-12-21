const jwt = require('jsonwebtoken');
const AuthError = require('../utils/errors/AuthError');
const { messages } = require('../utils/constants');

const { NODE_ENV = 'development', JWT_SECRET = 'dev-secret' } = process.env;

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return next(new AuthError(messages));
  }

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    next(new AuthError(messages.notAuthorized));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};
