/**
 * AuthContext — Compatibility shim backed by Redux.
 * Components that still call useAuth() continue working unchanged.
 * All state lives in the Redux store (store/authSlice.js).
 */
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, registerUser, logout as logoutAction, updateUser } from "../store/authSlice";
import toast from "react-hot-toast";

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);

  const login = useCallback(
    async (credentials) => {
      const result = await dispatch(loginUser(credentials));
      if (loginUser.rejected.match(result)) {
        throw new Error(result.payload || "Login failed");
      }
      toast.success(`Welcome back, ${result.payload.user.name}! 👋`);
      return result.payload;
    },
    [dispatch]
  );

  const register = useCallback(
    async (userData) => {
      const result = await dispatch(registerUser(userData));
      if (registerUser.rejected.match(result)) {
        throw new Error(result.payload || "Registration failed");
      }
      toast.success("Account created successfully! 🎉");
      return result.payload;
    },
    [dispatch]
  );

  const logout = useCallback(() => {
    dispatch(logoutAction());
    toast.success("Logged out successfully");
  }, [dispatch]);

  const update = useCallback(
    (updatedUser) => dispatch(updateUser(updatedUser)),
    [dispatch]
  );

  return { user, loading, error, login, register, logout, updateUser: update };
};

// Kept for any legacy AuthProvider wrappers — now a no-op passthrough
export const AuthProvider = ({ children }) => children;
