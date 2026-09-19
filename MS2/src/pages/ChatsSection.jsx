import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/common/PageHeader";

import { useEffect, useMemo, useState } from "react";
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

  const [searchParams, setSearchParams] = useSearchParams();

  const requestedChatId = searchParams.get("chatId");
  const targetUserId = searchParams.get("targetUserId");

  const [chats, setChats] = useState(() =>
    getChatsForCurrentUser()
  );

  const [selectedChatId, setSelectedChatId] = useState(() => {
    if (requestedChatId) {
      return requestedChatId;
    }

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

    window.addEventListener(
      CHAT_STORE_EVENT,
      refreshChats
    );

    window.addEventListener(
      "storage",
      refreshChats
    );

    return () => {
      window.removeEventListener(
        CHAT_STORE_EVENT,
        refreshChats
      );

      window.removeEventListener(
        "storage",
        refreshChats
      );
    };
  }, [currentUser?.id]);

  useEffect(() => {
    if (requestedChatId) {
      const chatExists = chats.some(
        (chat) =>
          String(chat.id) === String(requestedChatId)
      );

      if (chatExists) {
        setSelectedChatId(requestedChatId);
      }

      return;
    }

    if (!targetUserId || !currentUser?.id) {
      return;
    }

    const existingChat = getExistingDirectChat(
      targetUserId,
      currentUser.id
    );

    if (existingChat?.id) {
      setSelectedChatId(existingChat.id);
      return;
    }

    setSelectedChatId(
      `draft-${currentUser.id}-${targetUserId}`
    );
  }, [
    requestedChatId,
    targetUserId,
    chats,
    currentUser?.id,
  ]);

  const draftChat = useMemo(() => {
    if (!targetUserId || !currentUser?.id) {
      return null;
    }

    const existingChat = chats.find((chat) => {
      const participantIds = (
        chat.participantIds || []
      ).map(String);

      return (
        participantIds.length === 2 &&
        participantIds.includes(
          String(currentUser.id)
        ) &&
        participantIds.includes(
          String(targetUserId)
        )
      );
    });

    if (existingChat) {
      return null;
    }

    const targetUser = getUserById(targetUserId);

    if (!targetUser) {
      return null;
    }

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
      participantIds: [
        currentUser.id,
        targetUserId,
      ],
      name: targetName,
      avatar: targetUser.avatar,
      online: false,
      unreadBy: [],
      messages: [],
    };
  }, [
    targetUserId,
    currentUser?.id,
    chats,
  ]);

  const selectedChat =
    chats.find(
      (chat) =>
        String(chat.id) === String(selectedChatId)
    ) ||
    (draftChat &&
    String(draftChat.id) ===
      String(selectedChatId)
      ? draftChat
      : null);

  useEffect(() => {
    if (
      !selectedChatId ||
      !currentUser?.id ||
      selectedChat?.isDraft
    ) {
      return;
    }

    markChatAsRead(
      selectedChatId,
      currentUser.id
    );
  }, [
    selectedChatId,
    currentUser?.id,
    selectedChat?.isDraft,
  ]);

  const handleSelectChat = (chatId) => {
    setSelectedChatId(chatId);

    if (requestedChatId || targetUserId) {
      setSearchParams({}, { replace: true });
    }
  };

  const handleCreatedChat = (chatId) => {
    setSelectedChatId(chatId);

    if (requestedChatId || targetUserId) {
      setSearchParams({}, { replace: true });
    }
  };

  return (
    <DashboardLayout showFooter={false}>
      <section
        className="
          mx-auto
          flex
          w-full
          max-w-[1480px]
          flex-col
          gap-5
        "
      >
        <PageHeader
          //eyebrow="Message Center"
          title="Chats"
          description="Keep track of project conversations, feedback, and recruiter chats."
        />

        <div
          className="
            grid
            min-h-[500px]
            overflow-hidden
            rounded-[30px]
            border border-white/60
            bg-[rgba(255,255,255,0.40)]
            shadow-[0_24px_60px_rgba(27,63,85,0.14),0_6px_18px_rgba(27,63,85,0.08),inset_0_1px_0_rgba(255,255,255,0.82)]
            ring-1 ring-[rgba(109,163,195,0.08)]
            backdrop-blur-md

            h-[calc(100dvh-285px)]

            lg:grid-cols-[320px_minmax(0,1fr)]
            xl:grid-cols-[350px_minmax(0,1fr)]
            2xl:grid-cols-[390px_minmax(0,1fr)]
          "
        >
          <ChatSidebar
            chats={chats}
            selectedChatId={selectedChatId}
            setSelectedChatId={handleSelectChat}
          />

          <ChatWindow
            selectedChat={selectedChat}
            onCreatedChat={handleCreatedChat}
          />
        </div>
      </section>
    </DashboardLayout>
  );
}