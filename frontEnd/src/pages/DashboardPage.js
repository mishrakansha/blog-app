import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyPosts, deletePostThunk } from "../store/postsSlice";
import { formatDate, formatCount } from "../utils/helpers";
import { Spinner, EmptyState } from "../components/ui";
import toast from "react-hot-toast";

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { myPosts: posts, myPostsLoading: loading } = useSelector((s) => s.posts);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    dispatch(fetchMyPosts());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this post permanently?")) return;
    const result = await dispatch(deletePostThunk(id));
    if (deletePostThunk.fulfilled.match(result)) {
      toast.success("Post deleted");
    } else {
      toast.error("Failed to delete");
    }
  };

  const filteredPosts = posts.filter((p) =>
    activeTab === "all" ? true : p.status === activeTab
  );

  const totalViews = posts.reduce((acc, p) => acc + (p.views || 0), 0);
  const totalLikes = posts.reduce((acc, p) => acc + (p.likes?.length || 0), 0);
  const publishedCount = posts.filter((p) => p.status === "published").length;
  const draftCount = posts.filter((p) => p.status === "draft").length;

  const stats = [
    { icon: "📝", value: posts.length, label: "Total Posts", color: "#6366f1" },
    { icon: "👁", value: formatCount(totalViews), label: "Total Views", color: "#3b82f6" },
    { icon: "❤️", value: formatCount(totalLikes), label: "Total Likes", color: "#ec4899" },
    { icon: "✅", value: publishedCount, label: "Published", color: "#10b981" },
    { icon: "📋", value: draftCount, label: "Drafts", color: "#f59e0b" },
    { icon: "👥", value: formatCount(user?.followers?.length || 0), label: "Followers", color: "#8b5cf6" },
  ];

  return (
    <div className="dashboard-page">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">Welcome back, <strong>{user?.name}</strong>! 👋</p>
        </div>
        <Link to="/create-post" className="btn btn-primary">
          <span>+</span> Write New Post
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat) => (
          <div className="stat-card" key={stat.label}>
            <div className="stat-card-icon-wrap" style={{ background: stat.color + "18" }}>
              <span className="stat-card-icon">{stat.icon}</span>
            </div>
            <div>
              <p className="stat-card-value">{stat.value}</p>
              <p className="stat-card-label">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Posts Table */}
      <div className="dashboard-posts">
        <div className="dashboard-posts-header">
          <h2 className="dashboard-section-title">Your Posts</h2>
          <div className="tab-group">
            {["all", "published", "draft"].map((tab) => (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                <span className="tab-count">
                  {tab === "all" ? posts.length : posts.filter((p) => p.status === tab).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <Spinner />
        ) : filteredPosts.length === 0 ? (
          <EmptyState
            icon="📝"
            title={activeTab === "draft" ? "No drafts" : "No posts yet"}
            message="Start writing to see your posts here"
            action={<Link to="/create-post" className="btn btn-primary">Write Your First Post</Link>}
          />
        ) : (
          <div className="posts-table-wrapper">
            <table className="posts-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Views</th>
                  <th>Likes</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.map((post) => (
                  <tr key={post._id}>
                    <td>
                      <Link to={`/post/${post.slug}`} className="post-table-title">
                        {post.title.length > 50 ? post.title.slice(0, 50) + "..." : post.title}
                      </Link>
                    </td>
                    <td><span className="category-badge-sm">{post.category}</span></td>
                    <td>
                      <span className={`status-badge ${post.status}`}>
                        {post.status === "published" ? "✅ Published" : "📋 Draft"}
                      </span>
                    </td>
                    <td className="table-num">👁 {post.views}</td>
                    <td className="table-num">❤️ {post.likes?.length || 0}</td>
                    <td className="table-date">{formatDate(post.createdAt)}</td>
                    <td>
                      <div className="table-actions">
                        <Link to={`/post/${post.slug}`} className="table-action-btn view">View</Link>
                        <Link to={`/edit-post/${post._id}`} className="table-action-btn edit">Edit</Link>
                        <button className="table-action-btn delete" onClick={() => handleDelete(post._id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
