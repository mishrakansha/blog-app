import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import postsReducer from "./postsSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // allows non-serializable values if needed
    }),
});

export default store;
