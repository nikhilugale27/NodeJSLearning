const express = require('express');

const router = express.Router();

const usersController = require('../controllers/users_controller');

const passport = require('passport');

console.log('User Router Loaded....');

router.get('/profile/:id', passport.checkAuthentication, usersController.profile);

router.post('/update/:id', passport.checkAuthentication, usersController.update);

router.get('/sign-up', usersController.signUp);

router.get('/sign-in', usersController.signIn);

router.get('/sign-out', usersController.destroySession);

router.post('/create', usersController.create);

// use passport as a middleware to authenticate
router.post('/create-session', passport.authenticate(
    'local',
    {failureRedirect: '/users/sign-in'},
), usersController.createSession);

router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/users/sign-in'}), usersController.createSession);

//this will be used when user click on reset password
router.get('/reset-password', usersController.resetPassword);

//this will be called when user click on reset password
router.post('/send-reset-link' , usersController.sendResetPasswordLink);

router.get('/changePassword/:accessID', usersController.confirmPassword);

router.post('/confirm-password/:accessID', usersController.updateResetPassword);

module.exports = router;