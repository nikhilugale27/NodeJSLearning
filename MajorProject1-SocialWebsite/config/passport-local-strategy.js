const passport = require('passport');

const LocalStrategy = require('passport-local');

const User = require('../models/user');

//authentication using the passport
passport.use(new LocalStrategy({
        usernameField:'email'
    },
    function(email, password, done){
        //find the user
        User.findOne({email:email},function(err,user){
            if(err){
                console.log('Error in getting the passport data');
                return done(err);
            }
            if(!user || user.password != password)
            {
                console.log('Invalid username and password details');
                return done(null, false);
            }
            return done(null,user);
        });
    }
));


//Serializing the user to decide which key to kept in the cookies
passport.serializeUser(function(user,done){
    done(null,user.id);
});

//deserializing the user from key in the cookies
passport.deserializeUser(function(id,done){
    User.findById(id, function(err,user){
        if(err){
            console.log('Error in getting the User Details');
            return done(err);
        }
        return done(null,user);
    });
});

module.exports = passport;