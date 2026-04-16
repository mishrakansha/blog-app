import axios from "axios";

const API = axios.create({
  baseURL: "https://69ddc1c3babf2be39ce9d3a7-api-capstone.myanatomy.ai/api",
});

// ─── Request Interceptor: Attach Token ───────────────────────────────────
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── Response Interceptor: Handle Errors ─────────────────────────────────
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ─── Auth ──────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => API.post("/auth/register", data),
  login: (data) => API.post("/auth/login", data),
  getMe: () => API.get("/auth/me"),
  updatePassword: (data) => API.put("/auth/update-password", data),
};

// ─── Posts ─────────────────────────────────────────────────────────────────
export const postAPI = {
  getAll: (params) => API.get("/posts", { params }),
  getBySlug: (slug) => API.get(`/posts/${slug}`),
  create: (data) => API.post("/posts", data),
  update: (id, data) => API.put(`/posts/${id}`, data),
  delete: (id) => API.delete(`/posts/${id}`),
  like: (id) => API.put(`/posts/${id}/like`),
  getMyPosts: () => API.get("/posts/my-posts"),
  getTrending: () => API.get("/posts/trending"),
};

// ─── Comments ──────────────────────────────────────────────────────────────
export const commentAPI = {
  getAll: (postId) => API.get(`/comments/${postId}`),
  add: (postId, data) => API.post(`/comments/${postId}`, data),
  delete: (id) => API.delete(`/comments/${id}`),
  like: (id) => API.put(`/comments/${id}/like`),
};

// ─── Users ─────────────────────────────────────────────────────────────────
export const userAPI = {
  getProfile: (username) => API.get(`/users/${username}`),
  updateProfile: (data) => API.put("/users/profile", data),
  follow: (id) => API.put(`/users/${id}/follow`),
  savePost: (postId) => API.put(`/users/save/${postId}`),
  getSavedPosts: () => API.get("/users/saved-posts"),
};

export default API;
