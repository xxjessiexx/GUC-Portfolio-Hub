import DashboardLayout from "@/components/layout/DashboardLayout";
import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import {
  CHAT_STORE_EVENT,
  getChatsForCurrentUser,
  getCurrentUser,
  getExistingDirectChat,
  getUserById,
  markChatAsRead,
} from "@/data/demoStore";

import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatWindow from "@/components/chat/ChatWindow";

export default function ChatsSection() {
  const currentUser = getCurrentUser();
  const [searchParams] = useSearchParams();
  const requestedChatId = searchParams.get("chatId");
  const targetUserId = searchParams.get("targetUserId");

  const [chats, setChats] = useState(() => getChatsForCurrentUser());

  const [selectedChatId, setSelectedChatId] = useState(() => {
    if (requestedChatId) return requestedChatId;
    if (targetUserId && currentUser?.id) {
      return `draft-${currentUser.id}-${targetUserId}`;
    }
    return null;
  });

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
    if (requestedChatId) {
      const chatExists = chats.some(
        (chat) => String(chat.id) === String(requestedChatId)
      );

      if (chatExists) setSelectedChatId(requestedChatId);
      return;
    }

    if (!targetUserId || !currentUser?.id) return;

    const existingChat = getExistingDirectChat(targetUserId, currentUser.id);

    if (existingChat?.id) {
      setSelectedChatId(existingChat.id);
      return;
    }

    setSelectedChatId(`draft-${currentUser.id}-${targetUserId}`);
  }, [requestedChatId, targetUserId, chats, currentUser?.id]);

  const draftChat = useMemo(() => {
    if (!targetUserId || !currentUser?.id) return null;

    const existingChat = chats.find((chat) => {
      const participantIds = (chat.participantIds || []).map(String);
      return (
        participantIds.length === 2 &&
        participantIds.includes(String(currentUser.id)) &&
        participantIds.includes(String(targetUserId))
      );
    });

    if (existingChat) return null;

    const targetUser = getUserById(targetUserId);
    if (!targetUser) return null;

    const targetName =
      targetUser.name ||
      targetUser.fullName ||
      targetUser.displayName ||
      targetUser.companyName ||
      "New conversation";

    return {
      id: `draft-${currentUser.id}-${targetUserId}`,
      isDraft: true,
      targetUserId,
      participantIds: [currentUser.id, targetUserId],
      name: targetName,
      avatar: targetUser.avatar,
      online: false,
      unreadBy: [],
      messages: [],
    };
  }, [targetUserId, currentUser?.id, chats]);

  const selectedChat =
    chats.find((chat) => String(chat.id) === String(selectedChatId)) ||
    (draftChat && String(draftChat.id) === String(selectedChatId)
      ? draftChat
      : null);

  useEffect(() => {
    if (!selectedChatId || !currentUser?.id || selectedChat?.isDraft) return;

    markChatAsRead(selectedChatId, currentUser.id);
  }, [selectedChatId, currentUser?.id, selectedChat?.isDraft]);

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
            onCreatedChat={(chatId) => setSelectedChatId(chatId)}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}