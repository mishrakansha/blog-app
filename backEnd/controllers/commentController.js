import * as commentService from "../services/commentService.js";

// ─── @desc    Get Comments for a Post
// ─── @route   GET /api/comments/:postId
// ─── @access  Public
export const getComments = async (req, res) => {
  const comments = await commentService.fetchComments(req.params.postId);
  res.json({ success: true, comments });
};

// ─── @desc    Add Comment
// ─── @route   POST /api/comments/:postId
// ─── @access  Private
export const addComment = async (req, res) => {
  const comment = await commentService.addNewComment(req.body, req.params.postId, req.user._id);
  res.status(201).json({ success: true, comment });
};

// ─── @desc    Delete Comment
// ─── @route   DELETE /api/comments/:id
// ─── @access  Private (Author/Admin)
export const deleteComment = async (req, res) => {
  await commentService.deleteExistingComment(req.params.id, req.user);
  res.json({ success: true, message: "Comment deleted" });
};

// ─── @desc    Like / Unlike Comment
// ─── @route   PUT /api/comments/:id/like
// ─── @access  Private
export const toggleCommentLike = async (req, res) => {
  const result = await commentService.toggleCommentLike(req.params.id, req.user._id);
  res.json({ success: true, ...result });
};
