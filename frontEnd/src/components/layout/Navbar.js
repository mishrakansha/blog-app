import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/authSlice";
import toast from "react-hot-toast";

const Navbar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    navigate("/");
    setDropdownOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">✍️</span>
          <span className="logo-text">InkWell</span>
        </Link>

        {/* Desktop Nav */}
        <div className="nav-links desktop-only">
          <Link to="/" className={`nav-link ${isActive("/") ? "active" : ""}`}>Home</Link>
          <Link to="/explore" className={`nav-link ${isActive("/explore") ? "active" : ""}`}>Explore</Link>
          {user && (
            <Link to="/dashboard" className={`nav-link ${isActive("/dashboard") ? "active" : ""}`}>
              Dashboard
            </Link>
          )}
        </div>

        {/* Desktop Right */}
        <div className="nav-right desktop-only">
          {user ? (
            <>
              <Link to="/create-post" className="btn btn-primary btn-sm">+ Write</Link>
              <div className="avatar-dropdown">
                <button className="avatar-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
                  <img src={user.avatar} alt={user.name} className="avatar-sm" />
                  <span className="avatar-name">{user.name.split(" ")[0]}</span>
                  <span className={`chevron ${dropdownOpen ? "open" : ""}`}>▾</span>
                </button>
                {dropdownOpen && (
                  <>
                    <div className="dropdown-backdrop" onClick={() => setDropdownOpen(false)} />
                    <div className="dropdown-menu">
                      <div className="dropdown-header">
                        <img src={user.avatar} alt={user.name} className="avatar-sm" />
                        <div>
                          <p className="dropdown-user-name">{user.name}</p>
                          <p className="dropdown-user-email">{user.email}</p>
                        </div>
                      </div>
                      <div className="dropdown-divider" />
                      <Link to={`/profile/${user.username}`} className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                        👤 My Profile
                      </Link>
                      <Link to="/dashboard" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                        📊 Dashboard
                      </Link>
                      <Link to="/saved" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                        🔖 Saved Posts
                      </Link>
                      <div className="dropdown-divider" />
                      <button className="dropdown-item danger" onClick={handleLogout}>
                        🚪 Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-ghost">Login</Link>
              <Link to="/register" className="btn btn-primary">Get Started</Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button className="hamburger mobile-only" onClick={() => setMenuOpen(!menuOpen)}>
          <span className={`hamburger-line ${menuOpen ? "open" : ""}`} />
          <span className={`hamburger-line ${menuOpen ? "open" : ""}`} />
          <span className={`hamburger-line ${menuOpen ? "open" : ""}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <Link to="/" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>🏠 Home</Link>
          <Link to="/explore" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>🔍 Explore</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>📊 Dashboard</Link>
              <Link to="/create-post" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>✏️ Write Post</Link>
              <Link to={`/profile/${user.username}`} className="mobile-nav-link" onClick={() => setMenuOpen(false)}>👤 Profile</Link>
              <button className="mobile-nav-link danger" onClick={handleLogout}>🚪 Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>🔑 Login</Link>
              <Link to="/register" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>🚀 Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
