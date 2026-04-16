import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts as fetchPostsThunk } from "../store/postsSlice";
import { postAPI } from "../services/api";
import toast from "react-hot-toast";

// ─── usePosts: Fetch posts via Redux ──────────────────────────────────────
export const usePosts = (params = {}) => {
  const dispatch = useDispatch();
  const { posts, loading, error, pagination } = useSelector((s) => s.posts);

  const paramsKey = JSON.stringify(params);

  const fetchPosts = useCallback(() => {
    dispatch(fetchPostsThunk(params));
  }, [paramsKey]); // eslint-disable-line

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  return { posts, loading, error, pagination, refetch: fetchPosts };
};

// ─── usePost: Fetch single post by slug (local state — not cached) ────────
export const usePost = (slug) => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    postAPI
      .getBySlug(slug)
      .then(({ data }) => setPost(data.post))
      .catch((err) => setError(err.response?.data?.message || "Post not found"))
      .finally(() => setLoading(false));
  }, [slug]);

  return { post, loading, error, setPost };
};

// ─── useLocalStorage ──────────────────────────────────────────────────────
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    localStorage.setItem(key, JSON.stringify(valueToStore));
  };

  return [storedValue, setValue];
};

// ─── useDebounce ─────────────────────────────────────────────────────────
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

// ─── useToggleLike: Optimistic like with Redux ────────────────────────────
export const useToggleLike = (postId, initialLikes = [], userId) => {
  const [likes, setLikes] = useState(initialLikes);
  const isLiked = userId ? likes.includes(userId) : false;

  const toggle = async () => {
    if (!userId) { toast.error("Please login to like posts"); return; }
    try {
      const { data } = await postAPI.like(postId);
      if (data.liked) {
        setLikes((prev) => [...prev, userId]);
      } else {
        setLikes((prev) => prev.filter((id) => id !== userId));
      }
    } catch {
      toast.error("Failed to update like");
    }
  };

  return { likes, isLiked, toggle };
};
