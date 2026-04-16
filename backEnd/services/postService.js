import Post from "../models/Post.js";
import Comment from "../models/Comment.js";

// ─── Get All Posts (search, filter, pagination) ───────────────────────────
export const fetchAllPosts = async ({ search, category, tag, page = 1, limit = 9, sort = "-createdAt" }) => {
  const query = { status: "published" };

  if (search)   query.$text = { $search: search };
  if (category) query.category = category;
  if (tag)      query.tags = tag;

  const [total, posts] = await Promise.all([
    Post.countDocuments(query),
    Post.find(query)
      .populate("author", "name username avatar")
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(Number(limit)),
  ]);

  return {
    total,
    pages: Math.ceil(total / limit),
    currentPage: Number(page),
    posts,
  };
};

// ─── Get Single Post by Slug ──────────────────────────────────────────────
export const fetchPostBySlug = async (slug) => {
  const post = await Post.findOneAndUpdate(
    { slug, status: "published" },
    { $inc: { views: 1 } },
    { new: true }
  ).populate("author", "name username avatar bio followers");

  if (!post) {
    const err = new Error("Post not found");
    err.statusCode = 404;
    throw err;
  }

  return post;
};

// ─── Create Post ──────────────────────────────────────────────────────────
export const createNewPost = async (postData, authorId) => {
  const { title, content, excerpt, coverImage, tags, category, status } = postData;

  const post = await Post.create({
    title,
    content,
    excerpt,
    coverImage,
    tags,
    category,
    status,
    author: authorId,
  });

  await post.populate("author", "name username avatar");
  return post;
};

// ─── Update Post ──────────────────────────────────────────────────────────
export const updateExistingPost = async (postId, updateData, requestingUser) => {
  const post = await Post.findById(postId);

  if (!post) {
    const err = new Error("Post not found");
    err.statusCode = 404;
    throw err;
  }

  const isOwner = post.author.toString() === requestingUser._id.toString();
  const isAdmin = requestingUser.role === "admin";

  if (!isOwner && !isAdmin) {
    const err = new Error("Not authorized to edit this post");
    err.statusCode = 403;
    throw err;
  }

  const updatedPost = await Post.findByIdAndUpdate(postId, updateData, {
    new: true,
    runValidators: true,
  }).populate("author", "name username avatar");

  return updatedPost;
};

// ─── Delete Post ──────────────────────────────────────────────────────────
export const deleteExistingPost = async (postId, requestingUser) => {
  const post = await Post.findById(postId);

  if (!post) {
    const err = new Error("Post not found");
    err.statusCode = 404;
    throw err;
  }

  const isOwner = post.author.toString() === requestingUser._id.toString();
  const isAdmin = requestingUser.role === "admin";

  if (!isOwner && !isAdmin) {
    const err = new Error("Not authorized to delete this post");
    err.statusCode = 403;
    throw err;
  }

  await Promise.all([
    post.deleteOne(),
    Comment.deleteMany({ post: post._id }),
  ]);
};

// ─── Toggle Like ──────────────────────────────────────────────────────────
export const togglePostLike = async (postId, userId) => {
  const post = await Post.findById(postId);

  if (!post) {
    const err = new Error("Post not found");
    err.statusCode = 404;
    throw err;
  }

  const isLiked = post.likes.includes(userId);

  if (isLiked) {
    post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
  } else {
    post.likes.push(userId);
  }

  await post.save();
  return { liked: !isLiked, likesCount: post.likes.length };
};

// ─── Get My Posts ─────────────────────────────────────────────────────────
export const fetchMyPosts = async (authorId) => {
  return Post.find({ author: authorId }).sort("-createdAt");
};

// ─── Get Trending Posts ───────────────────────────────────────────────────
export const fetchTrendingPosts = async () => {
  return Post.find({ status: "published" })
    .populate("author", "name username avatar")
    .sort({ views: -1, likes: -1 })
    .limit(5);
};
