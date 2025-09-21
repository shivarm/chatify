import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useChatStore = create((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true,

  toggleSound: () => {
    localStorage.setItem("isSoundEnabled", !get().isSoundEnabled);
    set({ isSoundEnabled: !get().isSoundEnabled });
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
  seSelectedUser: (selectedUser) => set({ selectedUser }),

  getAllContacts: async () => {
    set({ isUsersLoading: true });
    try {
      const response = await axiosInstance.get("/messages/contacts");
      set({ allContacts: response.data });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred while fetching all contacts."
      );
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMyChatPartners: async () => {
    set({ isUsersLoading: true });
    try {
      const response = await axiosInstance.get("/messages/chats");
      set({ chats: response.data });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred while getting chat partners."
      );
    } finally {
      set({ isUsersLoading: false });
    }
  },
}));
