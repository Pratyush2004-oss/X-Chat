import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";
import Comment from "../models/comment.model.js";
import Notification from "../models/notification.model.js";
import Posts from "../models/post.model.js";
import { getAuth } from "@clerk/express";
import mongoose from "mongoose";


// get all comments
export const getComments = asyncHandler(async (req, res) => {
    const { postId } = req.params();
    const comments = await Comment.find({ post: postId })
        .sort({ createdAt: -1 })
        .populate("user", "username fullName lastName profilePicture");

    res.status(200).json({ comments });
});

// creating and posting a comment
export const createComment = asyncHandler(async (req, res) => {
    const { userId } = getAuth(req);
    const { postId } = req.params;
    const { content } = req.body;

    if (!content || content.trim() === "") {
        return res.status(400).json({ error: "Comment content is required" });
    }
    const user = await User.findOne({ clerkId: userId });
    const post = await Posts.findById(postId);

    if (!user || !post) return res.status(404).json({ error: "Post or user not found" });

    const session = await mongoose.startSession();
    let comment;
    try {
        await session.withTransaction(async () => {
            comment = await Comment.create({
                content,
                post: postId,
                user: user._id
            })
        }, { session });

        // link comment to the post
        await session.withTransaction(async () => {
            await Posts.findByIdAndUpdate(postId, {
                $push: { comments: comment._id },
            });
        }, { session })
    } catch (error) {
        console.log("Error in creating comment: ", error);
        return res.status(500).json({ error: "Error in creating comment" });
    }
    finally {
        await session.endSession();
    }

    // create notification if not commenting on your own post
    if (!post.user.toString() !== user._id.toString()) {
        await Notification.create({
            from: user._id,
            to: post.user,
            post: postId,
            type: "comment",
            comment: comment._id,
        })
    }
    res.status(201).json({ comment });
});

// deleting a comment
export const deleteComment = asyncHandler(async (req, res) => {
    const { userId } = getAuth();
    const { commentId } = req.params;

    const user = await User.findOne({ clerkId: userId });
    const comment = await Comment.findById(commentId);
    if (!user || !comment) return res.status(404).json({ error: "User or comment not found" });

    if (comment.user.toString !== user._id.toString()) {
        return res.status(400).json({ error: "You can only delete your own comments" })
    }

    const postId = comment.post;
    // removing comment from the post
    await Posts.findByIdAndUpdate(postId, {
        $pull: { comments: commentId }
    });

    // deleting the notification also
    await Notification.findOneAndDelete({ comment: commentId });

    // deleting the comment
    await Comment.findByIdAndDelete(commentId);

    res.status(200).json({ message: "Comment deleted successfully" })


});