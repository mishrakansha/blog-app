import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authAPI } from "../services/api";

// ─── Async Thunks ─────────────────────────────────────────────────────────

export const verifyToken = createAsyncThunk(
  "auth/verifyToken",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) return rejectWithValue("No token");
    try {
      const { data } = await authAPI.getMe();
      return data.user;
    } catch {
      return rejectWithValue("Token invalid");
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await authAPI.login(credentials);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await authAPI.register(userData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Registration failed");
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────

const getStoredUser = () => {
  try { return JSON.parse(localStorage.getItem("user")) || null; }
  catch { return null; }
};

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: getStoredUser(),
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      state.user = null;
      state.token = null;
      state.loading = false;
    },
    updateUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      // verifyToken
      .addCase(verifyToken.pending, (state) => { state.loading = true; })
      .addCase(verifyToken.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(verifyToken.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.loading = false;
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      })
      // loginUser
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.loading = false;
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // registerUser
      .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.loading = false;
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, updateUser, clearError } = authSlice.actions;
export default authSlice.reducer;
