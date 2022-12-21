const router = require('express').Router();
const NotFoundError = require('../utils/errors/NotFoundError');
const auth = require('../middlewares/auth');
const { createUser, login, signout } = require('../controllers/users');
const { signupRule, signinRule } = require('../utils/validationRules');
const { messages } = require('../utils/constants');

router.post('/signup', signupRule, createUser);
router.post('/signin', signinRule, login);
router.post('/signout', signout);

router.use(auth);

router.use('/users', require('./users'));
router.use('/movies', require('./movies'));

router.use((req, res, next) => {
  next(new NotFoundError(messages.notFound));
});

module.exports = router;
