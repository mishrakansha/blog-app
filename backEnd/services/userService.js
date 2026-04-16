import User from "../models/User.js";
import Post from "../models/Post.js";

// ─── Get User Profile by Username ─────────────────────────────────────────
export const fetchUserProfile = async (username) => {
  const user = await User.findOne({ username }).select("-password");

  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }

  const posts = await Post.find({ author: user._id, status: "published" }).sort("-createdAt");
  return { user, posts };
};

// ─── Update Profile ───────────────────────────────────────────────────────
export const updateUserProfile = async (userId, { name, bio, avatar }) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { name, bio, avatar },
    { new: true, runValidators: true }
  ).select("-password");

  return user;
};

// ─── Toggle Follow / Unfollow ─────────────────────────────────────────────
export const toggleFollowUser = async (targetUserId, requestingUserId) => {
  if (targetUserId === requestingUserId.toString()) {
    const err = new Error("You cannot follow yourself");
    err.statusCode = 400;
    throw err;
  }

  const targetUser = await User.findById(targetUserId);

  if (!targetUser) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }

  const isFollowing = targetUser.followers.includes(requestingUserId);

  if (isFollowing) {
    targetUser.followers = targetUser.followers.filter(
      (id) => id.toString() !== requestingUserId.toString()
    );
    await User.findByIdAndUpdate(requestingUserId, { $pull: { following: targetUserId } });
  } else {
    targetUser.followers.push(requestingUserId);
    await User.findByIdAndUpdate(requestingUserId, { $addToSet: { following: targetUserId } });
  }

  await targetUser.save();
  return { following: !isFollowing, followersCount: targetUser.followers.length };
};

// ─── Toggle Save / Unsave Post ────────────────────────────────────────────
export const toggleSavedPost = async (userId, postId) => {
  const user = await User.findById(userId);
  const isSaved = user.savedPosts.includes(postId);

  if (isSaved) {
    user.savedPosts = user.savedPosts.filter((id) => id.toString() !== postId);
  } else {
    user.savedPosts.push(postId);
  }

  await user.save();
  return { saved: !isSaved };
};

// ─── Get Saved Posts ──────────────────────────────────────────────────────
export const fetchSavedPosts = async (userId) => {
  const user = await User.findById(userId).populate({
    path: "savedPosts",
    populate: { path: "author", select: "name username avatar" },
  });

  return user.savedPosts;
};
