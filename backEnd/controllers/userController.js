import * as userService from "../services/userService.js";

// ─── @desc    Get User Profile by Username
// ─── @route   GET /api/users/:username
// ─── @access  Public
export const getUserProfile = async (req, res) => {
  const { user, posts } = await userService.fetchUserProfile(req.params.username);
  res.json({ success: true, user, posts });
};

// ─── @desc    Update My Profile
// ─── @route   PUT /api/users/profile
// ─── @access  Private
export const updateProfile = async (req, res) => {
  const user = await userService.updateUserProfile(req.user._id, req.body);
  res.json({ success: true, message: "Profile updated!", user });
};

// ─── @desc    Follow / Unfollow User
// ─── @route   PUT /api/users/:id/follow
// ─── @access  Private
export const toggleFollow = async (req, res) => {
  const result = await userService.toggleFollowUser(req.params.id, req.user._id);
  res.json({ success: true, ...result });
};

// ─── @desc    Save / Unsave Post
// ─── @route   PUT /api/users/save/:postId
// ─── @access  Private
export const toggleSavePost = async (req, res) => {
  const result = await userService.toggleSavedPost(req.user._id, req.params.postId);
  res.json({ success: true, ...result });
};

// ─── @desc    Get Saved Posts
// ─── @route   GET /api/users/saved-posts
// ─── @access  Private
export const getSavedPosts = async (req, res) => {
  const posts = await userService.fetchSavedPosts(req.user._id);
  res.json({ success: true, posts });
};
