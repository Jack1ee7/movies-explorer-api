const router = require('express').Router();
const {
  getCurrentUser, updateProfile,
} = require('../controllers/users');
const { updateProfileRule, getUserRule } = require('../utils/validationRules');

router.get('/me', getUserRule, getCurrentUser);
router.patch('/me', updateProfileRule, updateProfile);

module.exports = router;
