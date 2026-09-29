// features/auth/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // ─── Login / set credentials ──────────────────────────
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },

    // ─── Logout – clear everything user-related ───────────
    logout: (state) => {
      state.userInfo = null;

      // Clear ALL keys we might have stored
      localStorage.removeItem("userInfo");
      localStorage.removeItem("flanorx_auth");
      localStorage.removeItem("token");
      localStorage.removeItem("persist:root");
      localStorage.removeItem("cart");
      localStorage.removeItem("recentSearch");
      localStorage.removeItem("theme");

      // Clear session storage too
      sessionStorage.clear();

      // Optionally clear cookies (if your backend sets any)
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;