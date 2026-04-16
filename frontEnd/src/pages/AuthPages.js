import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSelector } from "react-redux";

export const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [localError, setLocalError] = useState("");
  const { login } = useAuth();
  const { loading } = useSelector((s) => s.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    try {
      await login(form);
      navigate(from, { replace: true });
    } catch (err) {
      setLocalError(err.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-visual">
        <div className="auth-visual-content">
          <div className="auth-visual-logo">✍️</div>
          <h2 className="auth-visual-title">Welcome Back!</h2>
          <p className="auth-visual-text">Continue your writing journey. Your stories matter.</p>
          <div className="auth-quote">
            <span className="quote-mark">"</span>
            The scariest moment is always just before you start.
            <span className="quote-author">— Stephen King</span>
          </div>
          <div className="auth-visual-dots">
            <span className="dot active" />
            <span className="dot" />
            <span className="dot" />
          </div>
        </div>
      </div>

      <div className="auth-form-wrapper">
        <div className="auth-form-container">
          <Link to="/" className="auth-logo">✍️ InkWell</Link>
          <h1 className="auth-title">Sign In</h1>
          <p className="auth-subtitle">
            Don't have an account?{" "}
            <Link to="/register" className="auth-link">Create one free →</Link>
          </p>

          {localError && (
            <div className="alert alert-error">
              <span>⚠️</span> {localError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-wrapper">
                <span className="input-icon">📧</span>
                <input
                  type="email"
                  name="email"
                  className="form-input with-icon"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  autoFocus
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Password
                <Link to="/forgot-password" className="form-label-link">Forgot password?</Link>
              </label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type="password"
                  name="password"
                  className="form-input with-icon"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? (
                <span className="btn-loading"><span className="btn-spinner" /> Signing in...</span>
              ) : (
                "Sign In →"
              )}
            </button>
          </form>

          <div className="auth-divider"><span>or try the demo</span></div>
          <button
            className="btn btn-outline btn-full demo-btn"
            onClick={() => setForm({ email: "demo@inkwell.com", password: "demo1234" })}
          >
            🎯 Use Demo Account
          </button>
        </div>
      </div>
    </div>
  );
};

export const RegisterPage = () => {
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "" });
  const [localError, setLocalError] = useState("");
  const { register } = useAuth();
  const { loading } = useSelector((s) => s.auth);
  const navigate = useNavigate();

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    if (form.password.length < 6) {
      setLocalError("Password must be at least 6 characters");
      return;
    }
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      setLocalError(err.message || "Registration failed");
    }
  };

  const perks = [
    { icon: "✅", text: "Free forever" },
    { icon: "🚫", text: "No ads, ever" },
    { icon: "✏️", text: "Rich text editor" },
    { icon: "📊", text: "Analytics dashboard" },
  ];

  return (
    <div className="auth-page">
      <div className="auth-visual register-visual">
        <div className="auth-visual-content">
          <div className="auth-visual-logo">✍️</div>
          <h2 className="auth-visual-title">Join InkWell</h2>
          <p className="auth-visual-text">
            Share your ideas with thousands of curious readers worldwide.
          </p>
          <div className="auth-perks">
            {perks.map((p) => (
              <div key={p.text} className="auth-perk">
                <span>{p.icon}</span> {p.text}
              </div>
            ))}
          </div>
          <div className="auth-visual-dots">
            <span className="dot" />
            <span className="dot active" />
            <span className="dot" />
          </div>
        </div>
      </div>

      <div className="auth-form-wrapper">
        <div className="auth-form-container">
          <Link to="/" className="auth-logo">✍️ InkWell</Link>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">
            Already have an account?{" "}
            <Link to="/login" className="auth-link">Sign in →</Link>
          </p>

          {localError && (
            <div className="alert alert-error">
              <span>⚠️</span> {localError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div className="input-wrapper">
                  <span className="input-icon">👤</span>
                  <input type="text" name="name" className="form-input with-icon" placeholder="John Doe"
                    value={form.name} onChange={handleChange} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Username</label>
                <div className="input-wrapper">
                  <span className="input-icon">@</span>
                  <input type="text" name="username" className="form-input with-icon" placeholder="johndoe"
                    value={form.username} onChange={handleChange} required />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-wrapper">
                <span className="input-icon">📧</span>
                <input type="email" name="email" className="form-input with-icon" placeholder="you@example.com"
                  value={form.email} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input type="password" name="password" className="form-input with-icon"
                  placeholder="Min. 6 characters" value={form.password} onChange={handleChange}
                  required minLength={6} />
              </div>
              {form.password && (
                <div className="password-strength">
                  <div
                    className="password-strength-bar"
                    style={{
                      width: form.password.length >= 10 ? "100%" : form.password.length >= 6 ? "60%" : "30%",
                      background: form.password.length >= 10 ? "#10b981" : form.password.length >= 6 ? "#f59e0b" : "#ef4444",
                    }}
                  />
                  <span className="password-strength-label">
                    {form.password.length >= 10 ? "Strong" : form.password.length >= 6 ? "Fair" : "Weak"}
                  </span>
                </div>
              )}
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? (
                <span className="btn-loading"><span className="btn-spinner" /> Creating Account...</span>
              ) : (
                "Create Account →"
              )}
            </button>
          </form>

          <p className="auth-terms">
            By creating an account, you agree to our{" "}
            <Link to="/terms" className="auth-link">Terms of Service</Link> and{" "}
            <Link to="/privacy" className="auth-link">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
};
