import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, fetchTrending } from "../store/postsSlice";
import PostCard from "../components/blog/PostCard";
import { Spinner, EmptyState } from "../components/ui";

const CATEGORIES = [
  { name: "Technology", emoji: "💻" },
  { name: "Lifestyle", emoji: "✨" },
  { name: "Travel", emoji: "✈️" },
  { name: "Food", emoji: "🍕" },
  { name: "Health", emoji: "💪" },
  { name: "Business", emoji: "📈" },
  { name: "Education", emoji: "📚" },
];

const HomePage = () => {
  const dispatch = useDispatch();
  const { posts, loading, trending } = useSelector((s) => s.posts);

  useEffect(() => {
    dispatch(fetchPosts({ limit: 6, sort: "-createdAt" }));
    dispatch(fetchTrending());
  }, [dispatch]);

  return (
    <div className="home-page">
      {/* ─── Hero ─────────────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">✨ Welcome to InkWell</div>
          <h1 className="hero-title">
            Where <span className="hero-highlight">Great Ideas</span>
            <br /> Find Their Voice
          </h1>
          <p className="hero-subtitle">
            Discover stories, insights, and ideas from writers on any topic.
            Read, write, and connect with a community that thinks deeply.
          </p>
          <div className="hero-actions">
            <Link to="/explore" className="btn btn-primary btn-lg">Start Reading →</Link>
            <Link to="/register" className="btn btn-outline btn-lg">Start Writing</Link>
          </div>
          <div className="hero-stats">
            <div className="stat"><span className="stat-num">10K+</span><span className="stat-label">Articles</span></div>
            <div className="stat"><span className="stat-num">5K+</span><span className="stat-label">Writers</span></div>
            <div className="stat"><span className="stat-num">50K+</span><span className="stat-label">Readers</span></div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card floating-card card-1"><span>⚡</span><p>Redux Powered</p></div>
          <div className="hero-card floating-card card-2"><span>🗄️</span><p>MongoDB Atlas</p></div>
          <div className="hero-card floating-card card-3"><span>🔐</span><p>JWT Auth</p></div>
          <div className="hero-blob" />
        </div>
      </section>

      {/* ─── Categories ──────────────────────────────────────────── */}
      <section className="section categories-section">
        <div className="section-header">
          <h2 className="section-title">Browse by Topic</h2>
          <p className="section-subtitle">Find the content that matters to you</p>
        </div>
        <div className="categories-grid">
          {CATEGORIES.map((cat) => (
            <Link key={cat.name} to={`/explore?category=${cat.name}`} className="category-card">
              <span className="category-emoji">{cat.emoji}</span>
              <span className="category-name">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── Latest Posts ─────────────────────────────────────────── */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Latest Articles</h2>
          <Link to="/explore" className="see-all-link">See All →</Link>
        </div>
        {loading ? (
          <Spinner />
        ) : posts.length === 0 ? (
          <EmptyState
            icon="📝"
            title="No posts yet"
            message="Be the first to write something amazing!"
            action={<Link to="/create-post" className="btn btn-primary">Write a Post</Link>}
          />
        ) : (
          <div className="posts-grid">
            {posts.map((post) => <PostCard key={post._id} post={post} />)}
          </div>
        )}
      </section>

      {/* ─── Trending ─────────────────────────────────────────────── */}
      {trending.length > 0 && (
        <section className="section trending-section">
          <div className="section-header">
            <h2 className="section-title">🔥 Trending Now</h2>
          </div>
          <div className="trending-list">
            {trending.map((post, i) => (
              <PostCard key={post._id} post={post} variant="compact" rank={i + 1} />
            ))}
          </div>
        </section>
      )}

      {/* ─── CTA ─────────────────────────────────────────────────── */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to share your story?</h2>
          <p className="cta-subtitle">Join thousands of writers. Start your first post today.</p>
          <Link to="/register" className="btn btn-primary btn-lg">Join InkWell Free →</Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
