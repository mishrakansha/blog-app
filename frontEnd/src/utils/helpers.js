// ─── Format Date ──────────────────────────────────────────────────────────
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
};

export const timeAgo = (dateString) => {
  const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
  ];
  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
  }
  return "Just now";
};

// ─── Truncate Text ────────────────────────────────────────────────────────
export const truncate = (text, maxLength = 120) => {
  const clean = text.replace(/<[^>]+>/g, "");
  return clean.length > maxLength ? clean.slice(0, maxLength) + "..." : clean;
};

// ─── Get Category Color ───────────────────────────────────────────────────
export const getCategoryColor = (category) => {
  const colors = {
    Technology: "#6366f1",
    Lifestyle: "#ec4899",
    Travel: "#f59e0b",
    Food: "#ef4444",
    Health: "#10b981",
    Business: "#3b82f6",
    Education: "#8b5cf6",
    Other: "#6b7280",
  };
  return colors[category] || colors.Other;
};

// ─── Generate Avatar URL ──────────────────────────────────────────────────
export const getAvatarUrl = (username) =>
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

// ─── Format Number (1000 → 1K) ───────────────────────────────────────────
export const formatCount = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num?.toString() || "0";
};

// ─── Strip HTML Tags ──────────────────────────────────────────────────────
export const stripHtml = (html) => html?.replace(/<[^>]+>/g, "") || "";
