import { Link, useParams, useNavigate } from "react-router-dom";
import { usePost, useToggleLike } from "../hooks";
import { useAuth } from "../context/AuthContext";
import { postAPI, userAPI } from "../services/api";
import CommentSection from "../components/blog/CommentSection";
import { Spinner } from "../components/ui";
import { formatDate, getCategoryColor } from "../utils/helpers";
import toast from "react-hot-toast";
import { useState } from "react";

const PostDetailPage = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { post, loading, error, setPost } = usePost(slug);
  const [deleting, setDeleting] = useState(false);
  const [saved, setSaved] = useState(false);

  const { likes, isLiked, toggle: toggleLike } = useToggleLike(
    post?._id,
    post?.likes || [],
    user?._id
  );

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    setDeleting(true);
    try {
      await postAPI.delete(post._id);
      toast.success("Post deleted successfully");
      navigate("/dashboard");
    } catch {
      toast.error("Failed to delete post");
      setDeleting(false);
    }
  };

  const handleSave = async () => {
    if (!user) { toast.error("Please login to save posts"); return; }
    try {
      await userAPI.savePost(post._id);
      setSaved(!saved);
      toast.success(saved ? "Post removed from saved" : "Post saved!");
    } catch {
      toast.error("Failed to save post");
    }
  };

  if (loading) return <Spinner text="Loading article..." />;
  if (error) return (
    <div className="error-page">
      <h2>😕 {error}</h2>
      <Link to="/" className="btn btn-primary">Go Home</Link>
    </div>
  );

  const isAuthor = user?._id === post?.author?._id;
  const isAdmin = user?.role === "admin";

  return (
    <article className="post-detail-page">
      {/* ─── Cover Image ─────────────────────────────────────────── */}
      <div className="post-cover">
        <img src={post.coverImage} alt={post.title} className="post-cover-img" />
        <div className="post-cover-overlay" />
      </div>

      {/* ─── Post Header ─────────────────────────────────────────── */}
      <div className="post-header-container">
        <div className="post-header">
          <span
            className="category-badge large"
            style={{ background: getCategoryColor(post.category) }}
          >
            {post.category}
          </span>
          <h1 className="post-title">{post.title}</h1>
          <p className="post-excerpt">{post.excerpt}</p>

          {/* Author & Meta */}
          <div className="post-meta">
            <Link to={`/profile/${post.author?.username}`} className="post-author-card">
              <img src={post.author?.avatar} alt={post.author?.name} className="avatar-md" />
              <div>
                <p className="post-author-name">{post.author?.name}</p>
                <p className="post-author-username">@{post.author?.username}</p>
              </div>
            </Link>
            <div className="post-meta-divider" />
            <div className="post-meta-details">
              <span>📅 {formatDate(post.createdAt)}</span>
              <span>⏱ {post.readTime} min read</span>
              <span>👁 {post.views} views</span>
            </div>
          </div>

          {/* Tags */}
          {post.tags?.length > 0 && (
            <div className="post-tags">
              {post.tags.map((tag) => (
                <Link key={tag} to={`/explore?tag=${tag}`} className="tag"># {tag}</Link>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="post-actions">
            <button
              className={`action-btn like-btn ${isLiked ? "liked" : ""}`}
              onClick={toggleLike}
            >
              {isLiked ? "❤️" : "🤍"} {likes.length} Like{likes.length !== 1 ? "s" : ""}
            </button>
            <button className={`action-btn save-btn ${saved ? "saved" : ""}`} onClick={handleSave}>
              {saved ? "🔖 Saved" : "📌 Save"}
            </button>

            {(isAuthor || isAdmin) && (
              <>
                <Link to={`/edit-post/${post._id}`} className="action-btn edit-btn">✏️ Edit</Link>
                <button className="action-btn delete-btn" onClick={handleDelete} disabled={deleting}>
                  🗑 {deleting ? "Deleting..." : "Delete"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ─── Post Content ─────────────────────────────────────────── */}
      <div className="post-content-container">
        <div
          className="post-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* ─── Author Bio Card ──────────────────────────────────── */}
        <div className="author-bio-card">
          <img src={post.author?.avatar} alt={post.author?.name} className="avatar-lg" />
          <div>
            <h3 className="author-bio-name">{post.author?.name}</h3>
            <p className="author-bio-text">{post.author?.bio || "No bio yet."}</p>
            <Link to={`/profile/${post.author?.username}`} className="btn btn-outline btn-sm">
              View Profile
            </Link>
          </div>
        </div>

        {/* ─── Comments ─────────────────────────────────────────── */}
        <CommentSection postId={post._id} />
      </div>
    </article>
  );
};

export default PostDetailPage;
