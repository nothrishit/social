const Comment = require('../models/comment');
const Post = require('../models/post');
const Like = require('../models/like');


module.exports.toggleLike = async function (req, res) {

    try {
        // likes/toggle/?id=ggwp&type=Post
        
        let likeable;
        let deleted = false;

        if (req.query.type == 'Post') {
            likeable = await Post.findById(req.query.id).populate('likes');
        }
        else {
            likeable = await Comment.findById(req.query.id).populate('likes');
        }

        //check if likes already exists

        let existingLike = await Like.findOne({
            likeable: req.query.id,
            onModel: req.query.type,
            user: req.user._id
        });

        //if a like already exists
        if(existingLike){
            likeable.likes.pull(existingLike._id);
            likeable.save();

            existingLike.deleteOne();
            deleted = true;
        }
        //if like doesnot exists make a new like
        else{
            let newLike = await Like.create({
                user : req.user._id,
                likeable : req.query.id,
                onModel : req.query.type
            });
            likeable.likes.push(newLike._id);
            likeable.save();
        }

        return res.status(200).json({
            message : 'request successful',
            data : {
                deleted : deleted
            }
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'internal server error'
        });
    }
}