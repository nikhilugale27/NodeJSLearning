const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.create = async function(req,res){
    try{

        //this will create a new post in DB
        let post = await Post.create({
            content: req.body.content,
            user: req.user._id
        });

        //Call from the ajax
        if(req.xhr){
            return res.status(200).json({
                data:{
                    post: post
                },
                message: "Post Created!"
            });
        }

        req.flash('success', 'Post published!');
        return res.redirect('back');
    }
    catch(err)
    {
        req.flash('error', err);
        // added this to view the error on console as well
        console.log(err);
        return res.redirect('back');
    }
}


module.exports.destroy = async function(req, res)
{
    try{
        let post = await Post.findById(req.params.id);            // .id means converting the object id into string
        if (post.user == req.user.id){

            // this will remove the post
            post.remove();
    
            //this will remove the comments associated with above post
            await Comment.deleteMany({post: req.params.id});

            //call from the ajax
            if (req.xhr){
                return res.status(200).json({
                    data: {
                        post_id: req.params.id
                    },
                    message: "Post deleted"
                });
            }

            req.flash('success', 'Post and Associated comments deleted!');
            return res.redirect('back');
        }else{
            req.flash('error', 'You cannot delete this post!');
            return res.redirect('back');
        }
    }
    catch(err)
    {
        req.flash('error', err);
        return res.redirect('back');
    }
}