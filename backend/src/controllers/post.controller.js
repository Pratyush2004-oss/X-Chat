import asyncHandler from 'express-async-handler';
import Posts from '../models/post.model.js';
import User from '../models/user.model.js';
import { getAuth } from '@clerk/express';
import cloudinary from '../config/cloudinary.js';
import Notification from '../models/notification.model.js';
import Comment from '../models/comment.model.js';

// get all posts
export const getPosts = asyncHandler(async (req, res) => {
    const limit = req.query.limit || 15;
    const page = req.query.page || 1;
    const skip = (page - 1) * limit;

    const totalPosts = await Posts.countDocuments();

    const posts = await Posts.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("user", "username firstName lastName profilePicture")
        .populate({
            path: "comments",
            populate: {
                path: "user",
                select: "username firstName lastName profilePicture"
            }
        })
    res.status(200).json({
        posts,
        currentPage: page,
        totalPosts,
        totalPages: Math.ceil(totalPosts / limit)
    })
})

// get single post details
export const getSinglePost = asyncHandler(async (req, res) => {
    const { postId } = req.params();
    const post = await Posts.findById(postId)
        .populate("user", "username firstName lastName profilePicture")
        .populate({
            path: "comments",
            populate: {
                path: "user",
                select: "username firstName lastName profilePicture"
            }
        })
    if (!post) return res.status(404).json({ error: "No post found" })
    res.status(200).json({ post });
})

// get all posts of the user
export const getUserPosts = asyncHandler(async (req, res) => {
    const { username } = req.params();

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });

    const posts = await Posts.find({ user: user._id })
        .sort({ createdAt: -1 })
        .populate("user", "username firstName lastName profilePicture")
        .populate({
            path: "comments",
            populate: {
                path: "user",
                select: "username firstName lastName profilePicture"
            }
        })
    res.status(200).json({ posts })


})

// create post
export const createPost = asyncHandler(async (req, res) => {
    const { userId } = getAuth(req);
    const { content } = req.body;
    const imageFile = req.file;

    if (!content && !imageFile) return res.status(400).json({ error: "Either content or image is required for the post" });
    const user = await User.findOne({ clerkId: userId });
    if (!user) return res.status(404).json({ error: "User not found" });

    let imageUrl = "";

    // upload image to cloudinary
    if (imageFile) {
        try {
            const base64Image = `data:${imageFile.mimetype};base64,${imageFile.buffer.toString('base64')}`;
            const uploadResponse = await cloudinary.uploader.upload(base64Image, {
                folder: "social_media_posts",
                resource_type: "image",
                transformation: [
                    { width: 800, height: 600, crop: "limit" },
                    { quality: "auto" },
                    { format: "auto" }
                ]
            });
            imageUrl = uploadResponse.secure_url;
        } catch (uploadError) {
            console.log("Error uploading image to cloudinary", uploadError);
            return res.status(500).json({ error: "Failed to upload image" });
        }
    }

    const post = await Posts.create({ user: user._id, content: content || "", imageUrl });
    res.status(200).json({ post });
})

// like a post
export const likePost = asyncHandler(async (req, res) => {
    const { postId } = req.params();
    const { userId } = getAuth(req)

    const user = await User.findOne({ clerkId: userId });
    const post = await Posts.findById(postId);

    if (!user || !post) return res.status(404).json({ error: "User or post not found" });

    const isLiked = post.likes.includes(user._id);
    if (isLiked) {
        // unlike
        await Posts.findByIdAndUpdate(postId, {
            $pull: { likes: user._id },
        })
    }
    else {
        // like
        await Posts.findByIdAndUpdate(postId, {
            $push: { likes: user._id }
        })

        // create notification
        if (post.user.toString() !== user._id.toString()) {
            await Notification.create({
                from: user._id,
                to: post.user,
                type: "like",
                post: postId
            })
        }
    }

})

// delete post
export const deletePost = asyncHandler(async (req, res) => {
    const { userId } = getAuth(req);
    const { postId } = req.params();

    const post = await Posts.findById(postId);
    const user = await User.findOne({ clerkId: userId });

    // check if the post is of the perticular user or not
    if (post.user.toString() !== user._id.toString()) {
        return res.status(403).json({ error: "You can only delete your own posts" })
    }

    // delete all comments of that perticular post
    await Comment.deleteMany({ post: postId });

    // delete image from cloudinary as well
    if (post.image && post.image.includes("cloudinary")) {
        try {
            const publicId = post.image.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(publicId);
        } catch (error) {
            console.log("Error in deleting Image from Cloudinary: ", error);
        }
    }
    // delete post
    await Posts.findByIdAndDelete(postId);

    res.status(200).json({ message: "Post deleted successfully" })
})