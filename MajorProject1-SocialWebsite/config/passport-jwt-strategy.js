const passport = require('passport');
const { deleteOne } = require('../models/user');

const JWTStrategy = require('passport-jwt').Strategy;

const ExtractJWT = require('passport-jwt').ExtractJwt;

const User = require('../models/user');

//Need to provide some options
var opts = {}
opts.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'Codeial';

passport.use(new JWTStrategy (opts, function(jwtPayLoad){
    User.findById(jwtPayLoad._id, function(err, user){
        if(err)
        {
            console.log('Error is finding user in JWT');
            return;
        }
        if(user){
            return done(null,user);
        }
        else{
            return done(null, false);
        }
    });
}));

module.exports = passport;