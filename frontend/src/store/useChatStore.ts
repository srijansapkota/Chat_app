import { create } from "zustand";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import type { User, Message } from "../types";

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof AxiosError) {
    return error.response?.data?.message || fallback;
  }
  return fallback;
};

let messageListener: ((message: Message) => void) | null = null;

interface ChatState {
  messages: Message[];
  users: User[];
  selectedUser: User | null;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;
  getUsers: () => Promise<void>;
  getMessages: (userId: string) => Promise<void>;
  sendMessage: (messageData: { text: string; image: string | null }) => Promise<void>;
  subscribeToMessages: () => void;
  unsubscribeFromMessages: () => void;
  setSelectedUser: (user: User | null) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to fetch users"));
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to fetch messages"));
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    if (!selectedUser) return;
    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to send message"));
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    if (messageListener) {
      socket.off("newMessage", messageListener);
    }

    messageListener = (newMessage) => {
      const currentSelectedUser = get().selectedUser;
      if (!currentSelectedUser) return;

      const isFromSelectedUser =
        String(newMessage.senderId) === String(currentSelectedUser._id);
      if (!isFromSelectedUser) return;

      set({ messages: [...get().messages, newMessage] });
    };

    socket.on("newMessage", messageListener);
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket || !messageListener) return;
    socket.off("newMessage", messageListener);
    messageListener = null;
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
