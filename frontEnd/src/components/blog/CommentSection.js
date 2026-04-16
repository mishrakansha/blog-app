import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { commentAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { timeAgo } from "../../utils/helpers";
import toast from "react-hot-toast";

const CommentSection = ({ postId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data } = await commentAPI.getAll(postId);
        setComments(data.comments);
      } catch {
        toast.error("Failed to load comments");
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    if (!user) { toast.error("Please login to comment"); return; }

    setSubmitting(true);
    try {
      const { data } = await commentAPI.add(postId, {
        content: text,
        parentComment: replyTo,
      });

      if (replyTo) {
        setComments((prev) =>
          prev.map((c) =>
            c._id === replyTo
              ? { ...c, replies: [...(c.replies || []), data.comment] }
              : c
          )
        );
      } else {
        setComments((prev) => [data.comment, ...prev]);
      }

      setText("");
      setReplyTo(null);
      toast.success("Comment added!");
    } catch {
      toast.error("Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await commentAPI.delete(commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      toast.success("Comment deleted");
    } catch {
      toast.error("Failed to delete comment");
    }
  };

  const CommentItem = ({ comment, isReply = false }) => (
    <div className={`comment-item ${isReply ? "reply" : ""}`}>
      <img src={comment.author?.avatar} alt={comment.author?.name} className="avatar-xs" />
      <div className="comment-body">
        <div className="comment-header">
          <Link to={`/profile/${comment.author?.username}`} className="comment-author">
            {comment.author?.name}
          </Link>
          <span className="comment-date">{timeAgo(comment.createdAt)}</span>
        </div>
        <p className="comment-text">{comment.content}</p>
        <div className="comment-actions">
          {user && !isReply && (
            <button className="comment-action-btn" onClick={() => setReplyTo(comment._id)}>
              ↩ Reply
            </button>
          )}
          {user?._id === comment.author?._id && (
            <button className="comment-action-btn danger" onClick={() => handleDelete(comment._id)}>
              🗑 Delete
            </button>
          )}
          <span className="comment-likes">❤️ {comment.likes?.length || 0}</span>
        </div>

        {/* Replies */}
        {comment.replies?.map((reply) => (
          <CommentItem key={reply._id} comment={reply} isReply />
        ))}

        {/* Reply Form */}
        {replyTo === comment._id && (
          <form onSubmit={handleSubmit} className="reply-form">
            <input
              type="text"
              className="comment-input"
              placeholder={`Reply to ${comment.author?.name}...`}
              value={text}
              onChange={(e) => setText(e.target.value)}
              autoFocus
            />
            <div className="reply-form-actions">
              <button type="submit" className="btn btn-primary btn-sm" disabled={submitting}>
                {submitting ? "Posting..." : "Reply"}
              </button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setReplyTo(null)}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );

  return (
    <section className="comment-section">
      <h3 className="comment-section-title">
        💬 Comments ({comments.length})
      </h3>

      {/* Add Comment Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="add-comment-form">
          <img src={user.avatar} alt={user.name} className="avatar-sm" />
          <div className="comment-input-wrapper">
            <textarea
              className="comment-textarea"
              placeholder="Share your thoughts..."
              value={replyTo ? text : text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
            />
            <button type="submit" className="btn btn-primary" disabled={submitting || !text.trim()}>
              {submitting ? "Posting..." : "Post Comment"}
            </button>
          </div>
        </form>
      ) : (
        <div className="comment-login-prompt">
          <Link to="/login" className="btn btn-primary">Login to comment</Link>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="loading-spinner" />
      ) : comments.length === 0 ? (
        <p className="no-comments">No comments yet. Be the first to share your thoughts!</p>
      ) : (
        <div className="comments-list">
          {comments.map((comment) => (
            <CommentItem key={comment._id} comment={comment} />
          ))}
        </div>
      )}
    </section>
  );
};

export default CommentSection;
