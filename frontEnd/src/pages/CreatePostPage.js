import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { postAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const CATEGORIES = ["Technology", "Lifestyle", "Travel", "Food", "Health", "Business", "Education", "Other"];

const initialForm = {
  title: "",
  content: "",
  excerpt: "",
  coverImage: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800",
  category: "Technology",
  tags: "",
  status: "published",
};

const CreatePostPage = () => {
  const { id } = useParams(); // if id exists → edit mode
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false);
  const isEditMode = Boolean(id);

  // Load post data in edit mode
  useEffect(() => {
    if (!isEditMode) return;
    const loadPost = async () => {
      try {
        // We need to find post by id - using my-posts
        const { data } = await postAPI.getMyPosts();
        const post = data.posts.find((p) => p._id === id);
        if (post) {
          setForm({
            title: post.title,
            content: post.content,
            excerpt: post.excerpt || "",
            coverImage: post.coverImage,
            category: post.category,
            tags: post.tags?.join(", ") || "",
            status: post.status,
          });
        }
      } catch {
        toast.error("Failed to load post");
      }
    };
    loadPost();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (status = form.status) => {
    if (!form.title.trim() || !form.content.trim()) {
      toast.error("Title and content are required");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        status,
      };

      if (isEditMode) {
        await postAPI.update(id, payload);
        toast.success("Post updated successfully!");
      } else {
        const { data } = await postAPI.create(payload);
        toast.success("Post published! 🎉");
        navigate(`/post/${data.post.slug}`);
        return;
      }
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-page">
      <div className="create-post-header">
        <h1 className="create-post-title">
          {isEditMode ? "✏️ Edit Post" : "✍️ Write a New Post"}
        </h1>
        <div className="create-post-header-actions">
          <button className="btn btn-ghost" onClick={() => setPreview(!preview)}>
            {preview ? "✏️ Edit" : "👁 Preview"}
          </button>
          <button
            className="btn btn-outline"
            onClick={() => handleSubmit("draft")}
            disabled={loading}
          >
            💾 Save Draft
          </button>
          <button
            className="btn btn-primary"
            onClick={() => handleSubmit("published")}
            disabled={loading}
          >
            {loading ? "Publishing..." : isEditMode ? "Update Post" : "🚀 Publish"}
          </button>
        </div>
      </div>

      {preview ? (
        <div className="post-preview">
          <h1 className="preview-title">{form.title || "Your Title Here"}</h1>
          <img src={form.coverImage} alt="cover" className="preview-cover" />
          <div
            className="post-content"
            dangerouslySetInnerHTML={{ __html: form.content || "<p>Your content will appear here...</p>" }}
          />
        </div>
      ) : (
        <div className="create-post-form">
          {/* Title */}
          <div className="form-group">
            <input
              type="text"
              name="title"
              className="post-title-input"
              placeholder="Your post title..."
              value={form.title}
              onChange={handleChange}
              maxLength={150}
            />
            <span className="char-count">{form.title.length}/150</span>
          </div>

          {/* Cover Image */}
          <div className="form-group">
            <label className="form-label">Cover Image URL</label>
            <input
              type="url"
              name="coverImage"
              className="form-input"
              placeholder="https://..."
              value={form.coverImage}
              onChange={handleChange}
            />
            {form.coverImage && (
              <img src={form.coverImage} alt="preview" className="cover-preview" />
            )}
          </div>

          {/* Category & Tags Row */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select name="category" className="form-select" value={form.category} onChange={handleChange}>
                {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Tags (comma separated)</label>
              <input
                type="text"
                name="tags"
                className="form-input"
                placeholder="react, javascript, webdev"
                value={form.tags}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Excerpt */}
          <div className="form-group">
            <label className="form-label">Excerpt (optional - short description)</label>
            <textarea
              name="excerpt"
              className="form-textarea"
              placeholder="Write a short description of your post..."
              value={form.excerpt}
              onChange={handleChange}
              rows={2}
              maxLength={300}
            />
          </div>

          {/* Content */}
          <div className="form-group">
            <label className="form-label">Content (HTML supported)</label>
            <textarea
              name="content"
              className="form-textarea content-editor"
              placeholder="Write your amazing content here... You can use HTML tags like <b>, <h2>, <p>, <ul>, <li>, <code>, etc."
              value={form.content}
              onChange={handleChange}
              rows={20}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePostPage;
