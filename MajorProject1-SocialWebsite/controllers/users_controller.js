module.exports.profile = function(req,res){
    return res.render('user_profile', {
        title: "User Profile"
    });
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
    //ToDo Later
}

//Sign In and create a session for the User
module.exports.createSession = function(req,res){
     //ToDo Later
}