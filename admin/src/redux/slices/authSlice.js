import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const loginAdmin = createAsyncThunk(
  "auth/loginAdmin",
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", loginData);

      localStorage.setItem("adminToken", response.data.token);
      localStorage.setItem(
        "admin",
        JSON.stringify(response.data.admin)
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);

const savedAdmin = localStorage.getItem("admin");

const initialState = {
  admin: savedAdmin ? JSON.parse(savedAdmin) : null,
  token: localStorage.getItem("adminToken") || null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    logout: (state) => {
      state.admin = null;
      state.token = null;
      state.error = null;

      localStorage.removeItem("adminToken");
      localStorage.removeItem("admin");
    },

    clearAuthError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload.admin;
        state.token = action.payload.token;
        state.error = null;
      })

      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  logout,
  clearAuthError,
} = authSlice.actions;

export default authSlice.reducer;