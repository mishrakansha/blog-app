import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { postAPI } from "../services/api";

// ─── Async Thunks ─────────────────────────────────────────────────────────

export const fetchPosts = createAsyncThunk(
  "posts/fetchAll",
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await postAPI.getAll(params);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch posts");
    }
  }
);

export const fetchTrending = createAsyncThunk(
  "posts/fetchTrending",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await postAPI.getTrending();
      return data.posts;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const fetchMyPosts = createAsyncThunk(
  "posts/fetchMyPosts",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await postAPI.getMyPosts();
      return data.posts;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch your posts");
    }
  }
);

export const deletePostThunk = createAsyncThunk(
  "posts/delete",
  async (id, { rejectWithValue }) => {
    try {
      await postAPI.delete(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete post");
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────

const postsSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    myPosts: [],
    trending: [],
    loading: false,
    myPostsLoading: false,
    trendingLoading: false,
    error: null,
    myPostsError: null,
    pagination: { total: 0, pages: 1, currentPage: 1 },
  },
  reducers: {
    toggleLikeOptimistic: (state, action) => {
      const { postId, userId, liked } = action.payload;
      const update = (arr) =>
        arr.map((p) => {
          if (p._id !== postId) return p;
          return {
            ...p,
            likes: liked
              ? [...(p.likes || []), userId]
              : (p.likes || []).filter((id) => id !== userId),
          };
        });
      state.posts = update(state.posts);
      state.myPosts = update(state.myPosts);
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchPosts
      .addCase(fetchPosts.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.posts = action.payload.posts;
        state.pagination = {
          total: action.payload.total,
          pages: action.payload.pages,
          currentPage: action.payload.currentPage,
        };
        state.loading = false;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchTrending
      .addCase(fetchTrending.pending, (state) => { state.trendingLoading = true; })
      .addCase(fetchTrending.fulfilled, (state, action) => {
        state.trending = action.payload || [];
        state.trendingLoading = false;
      })
      .addCase(fetchTrending.rejected, (state) => { state.trendingLoading = false; })
      // fetchMyPosts
      .addCase(fetchMyPosts.pending, (state) => { state.myPostsLoading = true; state.myPostsError = null; })
      .addCase(fetchMyPosts.fulfilled, (state, action) => {
        state.myPosts = action.payload;
        state.myPostsLoading = false;
      })
      .addCase(fetchMyPosts.rejected, (state, action) => {
        state.myPostsLoading = false;
        state.myPostsError = action.payload;
      })
      // deletePost
      .addCase(deletePostThunk.fulfilled, (state, action) => {
        state.myPosts = state.myPosts.filter((p) => p._id !== action.payload);
        state.posts = state.posts.filter((p) => p._id !== action.payload);
      });
  },
});

export const { toggleLikeOptimistic } = postsSlice.actions;
export default postsSlice.reducer;
