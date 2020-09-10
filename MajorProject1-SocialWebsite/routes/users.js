const express = require('express');

const router = express.Router();

const usersController = require('../controllers/users_controller');

console.log('User Router Loaded....');

router.get('/profile', usersController.profile);

router.get('/sign-up', usersController.signUp);

router.get('/sign-in', usersController.signIn);

router.post('/createUser', usersController.createUser);

router.post('/createSession', usersController.createSession);

module.exports = router;