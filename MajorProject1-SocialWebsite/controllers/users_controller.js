const User = require('../models/user');

module.exports.profile = function(req,res){
    if (req.cookies.user_id){
        User.findById(req.cookies.user_id, function(err, user){
            if (user){
                return res.render('user_profile', {
                    title: "User Profile",
                    user: user
                })
            }else{
                return res.redirect('/users/sign-in');

            }
        });
    }else{
        return res.redirect('/users/sign-in');

    }
}

//render the Sign Up Page
module.exports.signUp = function(req,res){
    return res.render('user_sign_up',{
        title:"Codial | Sign Up"
    })
}

//render the Sign In Page
module.exports.signIn = function(req,res){
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

//Sign In and create a session for the User
module.exports.createSession = function(req,res){
     User.findOne({email:req.body.email}, function(err, user){
        if(err){
            console.log('Error in finding the user in Signing In...');
            return;
        }

        if(user){
            if(user.password != req.body.password){
                return res.redirect('back');
            }
            res.cookie('user_id', user.id);
            return res.redirect('/users/profile');
        }
        else{
            return res.redirect('/users/sign-up');
        }
     });
}

//Sign In and create a session for the User
module.exports.signOutSession = function(req,res){
    //delete the user_id from the cookie 
    res.clearCookie('user_id');
    console.log('Cookie Cleared.')
    return res.redirect('/users/sign-in');
}