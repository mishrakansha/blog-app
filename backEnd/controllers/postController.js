import * as postService from "../services/postService.js";

// ─── @desc    Get All Published Posts
// ─── @route   GET /api/posts
// ─── @access  Public
export const getAllPosts = async (req, res) => {
  const result = await postService.fetchAllPosts(req.query);
  res.json({ success: true, ...result });
};

// ─── @desc    Get Single Post by Slug
// ─── @route   GET /api/posts/:slug
// ─── @access  Public
export const getPostBySlug = async (req, res) => {
  const post = await postService.fetchPostBySlug(req.params.slug);
  res.json({ success: true, post });
};

// ─── @desc    Create Post
// ─── @route   POST /api/posts
// ─── @access  Private
export const createPost = async (req, res) => {
  const post = await postService.createNewPost(req.body, req.user._id);
  res.status(201).json({ success: true, message: "Post created successfully!", post });
};

// ─── @desc    Update Post
// ─── @route   PUT /api/posts/:id
// ─── @access  Private (Author/Admin)
export const updatePost = async (req, res) => {
  const post = await postService.updateExistingPost(req.params.id, req.body, req.user);
  res.json({ success: true, message: "Post updated!", post });
};

// ─── @desc    Delete Post
// ─── @route   DELETE /api/posts/:id
// ─── @access  Private (Author/Admin)
export const deletePost = async (req, res) => {
  await postService.deleteExistingPost(req.params.id, req.user);
  res.json({ success: true, message: "Post deleted successfully" });
};

// ─── @desc    Like / Unlike Post
// ─── @route   PUT /api/posts/:id/like
// ─── @access  Private
export const toggleLike = async (req, res) => {
  const result = await postService.togglePostLike(req.params.id, req.user._id);
  res.json({ success: true, ...result });
};

// ─── @desc    Get My Posts (Dashboard)
// ─── @route   GET /api/posts/my-posts
// ─── @access  Private
export const getMyPosts = async (req, res) => {
  const posts = await postService.fetchMyPosts(req.user._id);
  res.json({ success: true, posts });
};

// ─── @desc    Get Trending Posts
// ─── @route   GET /api/posts/trending
// ─── @access  Public
export const getTrendingPosts = async (req, res) => {
  const posts = await postService.fetchTrendingPosts();
  res.json({ success: true, posts });
};
