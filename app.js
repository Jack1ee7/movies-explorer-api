const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const { errors } = require('celebrate');
const cors = require('cors');
const helmet = require('helmet');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const CORS = require('./utils/cors');
const limiter = require('./utils/limiter');
const { serverError } = require('./utils/errors/ServerError');

const { MONGO_URI = 'mongodb://127.0.0.1:27017/moviesdb' } = process.env;

const app = express();

app.use('*', cors(CORS));

app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.set('strictQuery', true);
mongoose.connect(MONGO_URI);

app.use(cookieParser());

app.use(requestLogger);

app.use(limiter);

app.use(require('./routes/index'));

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  serverError(err, req, res, next);
});

app.listen(3000);
