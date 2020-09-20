const User = require('../models/user');

module.exports.profile = function(req,res){
    User.findById(req.params.id, function(err, user){
        return res.render('user_profile', {
            title: user.name,
            profile_user: user
        });
    });
}

module.exports.update = function(req,res){
    if(req.user.id == req.params.id)
    {
        User.findByIdAndUpdate(req.params.id, req.body, function(err, user){
            return res.redirect('back');
            });
    }
    else{
        return res.status(401).send('Unauthorized Access.');
    }
}

//render the Sign Up Page
module.exports.signUp = function(req,res){
    //If already logged in redirect to profile page
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }

    return res.render('user_sign_up',{
        title:"Codial | Sign Up"
    })
}

//render the Sign In Page
module.exports.signIn = function(req,res){
    //If already logged in redirect to profile page
    if(req.isAuthenticated()){
        return res.redirect('/');
    }

    return res.render('user_sign_in',{
        title:"Codial | Sign In"
    })
}

//get the Sign Up Data
module.exports.createUser = function(req,res){
    if(req.body.password != req.body.confirm_password){
        return res.redirect('back');
    }

    User.findOne({email:req.body.email},function(err, user){
            if(err){
                console.log('Error in finding the user during the sign up');
                return;
            }

            if(!user){
                User.create(req.body, function(err, user){
                    if(err){
                        console.log('Error in creating the user while sign up');
                        return;
                    }
                    return res.redirect('/users/sign-in');
                })
            }
            else{
                return res.redirect('back');
            }
        }
    )
}

// sign in and create a session for the user
module.exports.createSession = function(req, res){
    req.flash('success', 'Logged In Successfully');
    return res.redirect('/');
}

module.exports.destroySession = function(req, res){
    req.logout();
    req.flash('success', 'You have Logged Out!');
    return res.redirect('/');
}