const Post = require('../../../models/post');
const Comment = require('../../../models/comment');

module.exports.index = async function(req, res){

    let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            }
        });

    return res.json(200, {
        message: "List of Posts",
        posts: posts
    });
}

module.exports.destroy = async function(req, res)
{
    try
    {

        let post = await Post.findById(req.params.id);            // .id means converting the object id into string
        // if (post.user == req.user.id){

            // this will remove the post
            post.remove();
    
            //this will remove the comments associated with above post
            await Comment.deleteMany({post: req.params.id});

            //call from the ajax
            /*if (req.xhr){
                return res.status(200).json({
                    data: {
                        post_id: req.params.id
                    },
                    message: "Post deleted"
                });
            }*/

            //req.flash('success', 'Post and Associated comments deleted!');
            //return res.redirect('back');
            return res.json(200,{
                message: 'The Post and Associated Comments are Deleted.'
            });
        //}
        //else{
        //    req.flash('error', 'You cannot delete this post!');
        //    return res.redirect('back');
        //}
    }    
    catch(err)
    {
        //req.flash('error', err);
        //return res.redirect('back');
        return res.json(500,{
            message: 'Internal Server Error.'
        });
    }
}
