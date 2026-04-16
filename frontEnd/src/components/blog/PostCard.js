import { Link } from "react-router-dom";
import { timeAgo, getCategoryColor, truncate } from "../../utils/helpers";

const PostCard = ({ post, variant = "default", rank }) => {
  const { title, slug, excerpt, content, coverImage, author, category, tags, likes, views, readTime, createdAt } = post;

  if (variant === "compact") {
    return (
      <div className="post-card-compact">
        {rank && <span className="compact-rank">#{rank}</span>}
        {coverImage && (
          <img src={coverImage} alt={title} className="post-card-compact-img" />
        )}
        <div className="post-card-compact-body">
          <span className="category-badge" style={{ background: getCategoryColor(category) }}>
            {category}
          </span>
          <Link to={`/post/${slug}`} className="post-card-compact-title">{title}</Link>
          <div className="post-meta-sm">
            <span>👁 {views}</span>
            <span>❤️ {likes?.length || 0}</span>
            <span>⏱ {readTime}m</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <article className="post-card">
      {/* Cover Image */}
      <Link to={`/post/${slug}`} className="post-card-img-wrapper">
        <img src={coverImage} alt={title} className="post-card-img" loading="lazy" />
        <div className="post-card-img-overlay" />
        <span className="category-badge floating" style={{ background: getCategoryColor(category) }}>
          {category}
        </span>
      </Link>

      {/* Body */}
      <div className="post-card-body">
        {/* Author */}
        <div className="post-card-author">
          <img src={author?.avatar} alt={author?.name} className="avatar-xs" />
          <div>
            <Link to={`/profile/${author?.username}`} className="author-name">
              {author?.name}
            </Link>
            <span className="post-date">{timeAgo(createdAt)}</span>
          </div>
          <span className="read-time-badge">⏱ {readTime} min</span>
        </div>

        {/* Title & Excerpt */}
        <Link to={`/post/${slug}`} className="post-card-title-link">
          <h2 className="post-card-title">{title}</h2>
        </Link>
        <p className="post-card-excerpt">{truncate(excerpt || content, 120)}</p>

        {/* Tags */}
        {tags?.length > 0 && (
          <div className="post-tags">
            {tags.slice(0, 3).map((tag) => (
              <Link key={tag} to={`/explore?tag=${tag}`} className="tag">#{tag}</Link>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="post-card-footer">
          <div className="post-stats">
            <span title="Views">👁 {views}</span>
            <span title="Likes">❤️ {likes?.length || 0}</span>
          </div>
          <Link to={`/post/${slug}`} className="read-more-btn">Read More →</Link>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
