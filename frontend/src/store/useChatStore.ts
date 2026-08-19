import { create } from "zustand";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import type { User, Message, ChatState } from "../types";

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof AxiosError) {
    return error.response?.data?.message || fallback;
  }
  return fallback;
};

let messageListener: ((message: Message) => void) | null = null;
let typingListener: ((data: { receiverId: string }) => void) | null = null;
let stopTypingListener: ((data: { receiverId: string }) => void) | null = null;


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

  subscribeTyping: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    if (typingListener) {
      socket.off("typing", typingListener);
    }
    if (stopTypingListener) {
      socket.off("stopTyping", stopTypingListener);
    }
    typingListener = () => {
      set({ isReceiverTyping: true });
    }
    stopTypingListener = () => {
      set({isReceiverTyping:false})
    }
    socket.on("typing", typingListener);
    socket.on("stopTyping", stopTypingListener)
  },

  unsubscribeFromTyping: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    if (typingListener) {
      socket.off("typing", typingListener)
      typingListener = null;
    }
    if (stopTypingListener) {
      socket.off("typing", stopTypingListener)
     stopTypingListener = null;
    }
  }
  

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
