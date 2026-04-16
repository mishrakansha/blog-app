import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { userAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import PostCard from "../components/blog/PostCard";
import { Spinner, EmptyState } from "../components/ui";
import { formatCount } from "../utils/helpers";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { username } = useParams();
  const { user: currentUser, updateUser } = useAuth();
  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", bio: "", avatar: "" });
  const [following, setFollowing] = useState(false);

  const isOwnProfile = currentUser?.username === username;

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const { data } = await userAPI.getProfile(username);
        setProfileUser(data.user);
        setPosts(data.posts);
        setFollowing(data.user.followers?.includes(currentUser?._id));
        setEditForm({ name: data.user.name, bio: data.user.bio, avatar: data.user.avatar });
      } catch {
        toast.error("Profile not found");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  const handleFollow = async () => {
    if (!currentUser) { toast.error("Please login"); return; }
    try {
      await userAPI.follow(profileUser._id);
      setFollowing(!following);
      setProfileUser((prev) => ({
        ...prev,
        followers: following
          ? prev.followers.filter((id) => id !== currentUser._id)
          : [...prev.followers, currentUser._id],
      }));
    } catch {
      toast.error("Failed to update follow");
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const { data } = await userAPI.updateProfile(editForm);
      setProfileUser(data.user);
      updateUser(data.user);
      setEditing(false);
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to update profile");
    }
  };

  if (loading) return <Spinner text="Loading profile..." />;
  if (!profileUser) return <div className="error-page"><h2>User not found</h2></div>;

  return (
    <div className="profile-page">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-cover" />
        <div className="profile-info">
          <div className="profile-avatar-wrapper">
            <img src={profileUser.avatar} alt={profileUser.name} className="avatar-xl" />
          </div>

          {editing ? (
            <form onSubmit={handleUpdateProfile} className="edit-profile-form">
              <input className="form-input" value={editForm.name} onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))} placeholder="Name" />
              <textarea className="form-textarea" value={editForm.bio} onChange={(e) => setEditForm((p) => ({ ...p, bio: e.target.value }))} placeholder="Bio..." rows={2} />
              <input className="form-input" value={editForm.avatar} onChange={(e) => setEditForm((p) => ({ ...p, avatar: e.target.value }))} placeholder="Avatar URL" />
              <div className="form-row">
                <button type="submit" className="btn btn-primary btn-sm">Save</button>
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => setEditing(false)}>Cancel</button>
              </div>
            </form>
          ) : (
            <div className="profile-details">
              <h1 className="profile-name">{profileUser.name}</h1>
              <p className="profile-username">@{profileUser.username}</p>
              {profileUser.bio && <p className="profile-bio">{profileUser.bio}</p>}

              <div className="profile-stats">
                <div className="profile-stat"><strong>{posts.length}</strong> Posts</div>
                <div className="profile-stat"><strong>{formatCount(profileUser.followers?.length)}</strong> Followers</div>
                <div className="profile-stat"><strong>{formatCount(profileUser.following?.length)}</strong> Following</div>
              </div>

              <div className="profile-actions">
                {isOwnProfile ? (
                  <button className="btn btn-outline" onClick={() => setEditing(true)}>✏️ Edit Profile</button>
                ) : (
                  <button
                    className={`btn ${following ? "btn-outline" : "btn-primary"}`}
                    onClick={handleFollow}
                  >
                    {following ? "✓ Following" : "+ Follow"}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Posts */}
      <div className="profile-posts">
        <h2 className="profile-posts-title">
          📝 {isOwnProfile ? "My" : `${profileUser.name}'s`} Posts ({posts.length})
        </h2>
        {posts.length === 0 ? (
          <EmptyState icon="📝" title="No posts yet" message="Nothing published here yet." />
        ) : (
          <div className="posts-grid">
            {posts.map((post) => <PostCard key={post._id} post={post} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
