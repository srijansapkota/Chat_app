// src/store/useAuthStore.js
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      // Axios automatically wraps the response data in `res.data`
      // and only resolves if the status is 2xx.
      set({ authUser: res.data });
    } catch (error) {
      // Axios error objects for non-2xx responses have a `response` property
      // which contains `data`, `status`, `headers`.
      console.log(
        "Error in checkAuth:",
        error.response?.data?.message || error.message
      );
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      // If we reach here, Axios considers the request successful (2xx status)
      set({ authUser: res.data });
      toast.success("Account created successfully");
    } catch (error) {
      // This block is executed if Axios receives a non-2xx status code from the server.
      // `error.response.data.message` is the standard way to get a server-provided error message.
      console.error(
        "Signup error:",
        error.response?.data?.message || error.message
      );
      toast.error(
        error.response?.data?.message || "Signup failed! Please try again."
      );
      // Ensure authUser is null if signup fails
      set({ authUser: null });
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
    } catch (error) {
      console.error(
        "Login error:",
        error.response?.data?.message || error.message
      );
      toast.error(
        error.response?.data?.message || "Login failed! Please try again."
      );
      set({ authUser: null }); // Ensure authUser is null if login fails
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
    } catch (error) {
      console.error(
        "Logout error:",
        error.response?.data?.message || error.message
      );
      toast.error(error.response?.data?.message || "Logout failed");
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));
