import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,

  checkAuth: async () => {
    try {
      const response = await axiosInstance.get("/auth/check");
      set({ authUser: response.data });
    } catch (error) {
      console.log("Error in authCheck", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signUp: async (data) => {
    set({ isSigningUp: true });
    try {
      const response = await axiosInstance.post("/auth/signup", data);
      set({ authUser: response.data });
      toast.success("Account created successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred during sign up.");
    } finally {
      set({ isSigningUp: false });
    }
  },
  logIn: async (data) => {
    set({ isLoggingIn: true });
    try {
      const response = await axiosInstance.post("/auth/login", data);
      set({ authUser: response.data });
      toast.success("Logged in successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred during login.");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logOut: async () => {
    try {
      const response = axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged Out successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred during log out.");
    }
  },
}));
