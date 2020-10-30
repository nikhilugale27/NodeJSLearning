const User = require('../models/user');
const fs = require('fs');
const path = require('path');
const resetPass = require('../models/resetPassword');
const crypto = require('crypto');
const resetPasswordData = require('../models/resetPassword');
const resetPasswordMailer = require('../mailers/reset_password_mailer');
const queue = require('../config/kue');

module.exports.profile = function(req,res){
    User.findById(req.params.id, function(err, user){
        return res.render('user_profile', {
            title: user.name,
            profile_user: user
        });
    });
}


module.exports.update = async function(req, res){
    /*if(req.user.id == req.params.id){
        User.findByIdAndUpdate(req.params.id, req.body, function(err, user){
            req.flash('success', 'Updated!');
            return res.redirect('back');
        });
    }else{
        req.flash('error', 'Unauthorized!');
        return res.status(401).send('Unauthorized');
    }*/

    //to upload the file
    if(req.user.id == req.params.id)
    {
        try
        {
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req,res,function(err)
            {
                if(err)
                {
                    console.log('******* Multer Error*******');
                }
                // console.log(req.file);
                user.name = req.body.name;
                user.email = req.body.email;
                if(req.file)
                {
                    if(user.avatar)
                    {
                        if (fs.existsSync(path.join(__dirname, '..', user.avatar))) 
                        {
                            //file exists then delete it
                            fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                        }
                    }
                    //saving the path of uploaded file in user
                    user.avatar = User.avatarPath + '\\' + req.file.filename;
                }
                user.save();
                return res.redirect('back');
            });
        }
        catch(err)
        {
            req.flash('error', err); 
            return res.redirect('back');
        }
    }
    else
    {
        req.flash('error', 'Unauthorized!');
        return res.status(401).send('Unauthorized');
    }
}


// render the sign up page
module.exports.signUp = function(req, res){
    if (req.isAuthenticated()){
        return res.redirect('/users/profile');
    }

    return res.render('user_sign_up', {
        title: "Codeial | Sign Up"
    })
}


// render the sign in page
module.exports.signIn = function(req, res){

    if (req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in', {
        title: "Codeial | Sign In"
    })
}

// get the sign up data
module.exports.create = function(req, res){
    if (req.body.password != req.body.confirm_password){
        req.flash('error', 'Passwords do not match');
        return res.redirect('back');
    }

    User.findOne({email: req.body.email}, function(err, user){
        if(err){req.flash('error', err); return}

        if (!user){
            User.create(req.body, function(err, user){
                if(err){req.flash('error', err); return}

                return res.redirect('/users/sign-in');
            })
        }else{
            req.flash('success', 'You have signed up, login to continue!');
            return res.redirect('back');
        }

    });
}


// sign in and create a session for the user
module.exports.createSession = function(req, res){
    req.flash('success', 'Logged in Successfully');
    return res.redirect('/');
}

module.exports.destroySession = function(req, res){
    req.logout();
    req.flash('success', 'You have logged out!');


    return res.redirect('/');
}

// reset password render page
module.exports.resetPassword = function(req, res){
    return res.render('user_pass_reset', {      
        title: "Codeial | Reset Password"
    })
}

//send the reset password link to user mail
module.exports.sendResetPasswordLink = async function(req, res)
{
    try
    {
        //check if the user is there or not
        let user = await User.findOne({email: req.body.email});

        if(!user){
            req.flash('error', 'No user with provided email id.')
            return res.redirect('back');
        }
        else{
            let acessID = crypto.randomBytes(20).toString('hex');

            //create the accessID for the user
            let resetData = await resetPasswordData.create({
                user: user,
                acessToken: acessID,
                isValid : true 
            });
            
            // Similar for comments to fetch the user's id!
            resetData = await resetData.populate('user', 'name email').execPopulate();
                            
            console.log(resetData);

            //reset password link generated and send the mail
            resetPasswordMailer.newReset(resetData);

            req.flash('success', 'Reset Link is Sent.');
            return res.redirect('/users/sign-in');
        }
    }catch(err){
        req.flash('error', err);
        return;
    }
}

//render confirm password page
module.exports.confirmPassword = async function(req, res){
    try{
        console.log(req.params.accessID);
        let accessToken = req.params.accessID;

        //check if the reset link is valid
        let accessRecord = await resetPasswordData.findOne({acessToken: accessToken});

        if(!accessRecord){
            req.flash('error', 'Invalid Reset Link. Please generate new Reset Link.');
            return res.redirect('/users/sign-in');
        }
        else if(!accessRecord.isValid){
            req.flash('error', 'Reset Link Expired Or Password Already Updated. Please generate new Reset Link.');
            return res.redirect('/users/sign-in');
        }
        else{
            return res.render('user_pass_confirm', {title: "Codeial | Confirm Password", accessToken: accessToken});
        }
    }catch(err){
        req.flash('error', err);
        return;
    }  
}

module.exports.updateResetPassword = async function(req, res)
{
    console.log(req.body.password);
    console.log(req.body.confirm_password);
    console.log(req.params.accessID);
    try{

        //check if password and confirm password matches or not
        if (req.body.password != req.body.confirm_password){
            req.flash('error', 'Passwords do not match');
            return res.redirect('back');
        }

        //check if the reset link is valid
        let accessRecord = await resetPasswordData.findOne({acessToken: req.params.accessID});
        console.log(accessRecord);

        if(!accessRecord){
            req.flash('error', 'Invalid Reset Link. Please generate new Reset Link.');
            return res.redirect('/users/sign-in');
        }
        else if(!accessRecord.isValid){
            req.flash('error', 'Reset Link Expired Or Password Already Updated. Please generate new Reset Link.');
            return res.redirect('/users/sign-in');
        }
        else{

            //change the password in Users Document
            let user_id = accessRecord.user;
            console.log('User_id' , user_id);

            let user = await User.findById(user_id);
            console.log('User Data :' , user);

            if(user)
            {
                user.password = req.body.password;
                user.save();

                accessRecord.isValid = false;
                accessRecord.save();

                req.flash('success', 'Password Updated Successfully. Please Sign In with New Credentials.');
            } 
            return res.redirect('/users/sign-in');
        }
    }
    catch(err){
        req.flash('error', err);
        return;
    }   
}