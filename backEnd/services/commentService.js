import Comment from "../models/Comment.js";
import Post from "../models/Post.js";

// ─── Get Comments for a Post ──────────────────────────────────────────────
export const fetchComments = async (postId) => {
  return Comment.find({ post: postId, parentComment: null })
    .populate("author", "name username avatar")
    .populate({
      path: "replies",
      populate: { path: "author", select: "name username avatar" },
    })
    .sort("-createdAt");
};

// ─── Add Comment ──────────────────────────────────────────────────────────
export const addNewComment = async ({ content, parentComment }, postId, authorId) => {
  const post = await Post.findById(postId);

  if (!post) {
    const err = new Error("Post not found");
    err.statusCode = 404;
    throw err;
  }

  const comment = await Comment.create({
    content,
    author: authorId,
    post: postId,
    parentComment: parentComment || null,
  });

  await comment.populate("author", "name username avatar");
  return comment;
};

// ─── Delete Comment ───────────────────────────────────────────────────────
export const deleteExistingComment = async (commentId, requestingUser) => {
  const comment = await Comment.findById(commentId);

  if (!comment) {
    const err = new Error("Comment not found");
    err.statusCode = 404;
    throw err;
  }

  const isOwner = comment.author.toString() === requestingUser._id.toString();
  const isAdmin = requestingUser.role === "admin";

  if (!isOwner && !isAdmin) {
    const err = new Error("Not authorized");
    err.statusCode = 403;
    throw err;
  }

  // Delete the comment + all its replies
  await Promise.all([
    comment.deleteOne(),
    Comment.deleteMany({ parentComment: comment._id }),
  ]);
};

// ─── Toggle Comment Like ──────────────────────────────────────────────────
export const toggleCommentLike = async (commentId, userId) => {
  const comment = await Comment.findById(commentId);

  if (!comment) {
    const err = new Error("Comment not found");
    err.statusCode = 404;
    throw err;
  }

  const isLiked = comment.likes.includes(userId);

  if (isLiked) {
    comment.likes = comment.likes.filter((id) => id.toString() !== userId.toString());
  } else {
    comment.likes.push(userId);
  }

  await comment.save();
  return { liked: !isLiked, likesCount: comment.likes.length };
};
