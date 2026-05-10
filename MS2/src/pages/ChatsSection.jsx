import DashboardLayout from "@/components/layout/DashboardLayout";
import { useState, useEffect } from "react";

import {
  CHAT_STORE_EVENT,
  getChatsForCurrentUser,
  getCurrentUser,
  markChatAsRead,
} from "@/data/demoStore";

import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatWindow from "@/components/chat/ChatWindow";

export default function ChatsSection() {
  const currentUser = getCurrentUser();

  const [chats, setChats] = useState(() =>
    getChatsForCurrentUser()
  );

  const [selectedChatId, setSelectedChatId] = useState(null);

  useEffect(() => {
    const refreshChats = () => {
      setChats(getChatsForCurrentUser());
    };

    refreshChats();

    window.addEventListener(CHAT_STORE_EVENT, refreshChats);
    window.addEventListener("storage", refreshChats);

    return () => {
      window.removeEventListener(CHAT_STORE_EVENT, refreshChats);
      window.removeEventListener("storage", refreshChats);
    };
  }, [currentUser?.id]);

  useEffect(() => {
    if (!selectedChatId || !currentUser?.id) return;

    markChatAsRead(selectedChatId, currentUser.id);
  }, [selectedChatId, currentUser?.id]);

  const selectedChat = chats.find(
    (chat) => chat.id === selectedChatId
  );

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-75px)] p-6">
        <div className="flex w-full overflow-hidden rounded-3xl bg-white shadow-lg">
          <ChatSidebar
            chats={chats}
            selectedChatId={selectedChatId}
            setSelectedChatId={setSelectedChatId}
          />

          <ChatWindow
            selectedChat={selectedChat}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}