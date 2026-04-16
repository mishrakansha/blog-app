// ─── Spinner ──────────────────────────────────────────────────────────────
export const Spinner = ({ size = "md", text = "Loading..." }) => (
  <div className={`spinner-wrapper spinner-${size}`}>
    <div className="spinner" />
    {text && <p className="spinner-text">{text}</p>}
  </div>
);

// ─── Empty State ──────────────────────────────────────────────────────────
export const EmptyState = ({ icon = "📭", title, message, action }) => (
  <div className="empty-state">
    <div className="empty-icon-wrap">
      <span className="empty-icon">{icon}</span>
    </div>
    <h3 className="empty-title">{title}</h3>
    <p className="empty-message">{message}</p>
    {action && <div className="empty-action">{action}</div>}
  </div>
);

// ─── Category Badge ───────────────────────────────────────────────────────
export const CategoryBadge = ({ category, onClick }) => {
  const colors = {
    Technology: "#6366f1", Lifestyle: "#ec4899", Travel: "#f59e0b",
    Food: "#ef4444", Health: "#10b981", Business: "#3b82f6",
    Education: "#8b5cf6", Other: "#6b7280",
  };
  return (
    <span
      className="category-badge"
      style={{ background: colors[category] || colors.Other, cursor: onClick ? "pointer" : "default" }}
      onClick={onClick}
    >
      {category}
    </span>
  );
};

// ─── Avatar ───────────────────────────────────────────────────────────────
export const Avatar = ({ src, name, size = "md" }) => (
  <img
    src={src || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`}
    alt={name}
    className={`avatar-${size}`}
    onError={(e) => { e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`; }}
  />
);

// ─── Search Bar ───────────────────────────────────────────────────────────
export const SearchBar = ({ value, onChange, placeholder = "Search posts..." }) => (
  <div className="search-bar">
    <span className="search-icon">🔍</span>
    <input
      type="text"
      className="search-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
    {value && (
      <button className="search-clear" onClick={() => onChange("")}>✕</button>
    )}
  </div>
);

// ─── Pagination ───────────────────────────────────────────────────────────
export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (!totalPages || totalPages <= 1) return null;

  const getPages = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = [1];
    if (currentPage > 3) pages.push("...");
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  return (
    <div className="pagination">
      <button className="page-btn" disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>
        ← Prev
      </button>
      {getPages().map((page, i) =>
        page === "..." ? (
          <span key={`dots-${i}`} className="page-dots">…</span>
        ) : (
          <button
            key={page}
            className={`page-btn ${page === currentPage ? "active" : ""}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        )
      )}
      <button className="page-btn" disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}>
        Next →
      </button>
    </div>
  );
};

// ─── Protected Route ──────────────────────────────────────────────────────
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useSelector((s) => s.auth);
  if (loading) return <Spinner />;
  return user ? children : <Navigate to="/login" replace />;
};
