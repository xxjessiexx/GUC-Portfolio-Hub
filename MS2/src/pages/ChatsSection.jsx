import DashboardLayout from "@/components/layout/DashboardLayout";
import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { MessageCircle } from "lucide-react";

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
import { AppCard } from "@/components/ui/AppCard";

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
      <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <AppCard className="relative overflow-hidden rounded-[32px] border-[color:var(--border-soft)] bg-[var(--surface)] px-4 py-6 shadow-[var(--shadow-soft)] sm:px-6 lg:px-8 lg:py-8">
          <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 translate-x-1/3 -translate-y-1/3 rounded-full bg-[radial-gradient(circle,rgba(230,199,123,0.12),transparent_70%)] blur-2xl" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 -translate-x-1/3 translate-y-1/3 rounded-full bg-[radial-gradient(circle,rgba(156,213,255,0.10),transparent_72%)] blur-2xl" />

          <div className="relative mx-auto max-w-6xl">
            <header className="mb-6 flex items-start gap-4">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-[color:var(--gold)]/30 bg-[linear-gradient(135deg,rgba(230,199,123,0.16),rgba(255,255,255,0.18))] text-[color:var(--gold)] shadow-[0_16px_38px_rgba(230,199,123,0.14)] sm:h-16 sm:w-16">
                <MessageCircle className="h-7 w-7" />
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[color:var(--primary)]">
                  Message Center
                </p>

                <h1 className="mt-2 text-3xl font-black tracking-tight text-[color:var(--ink)] sm:text-4xl">
                  Chats
                </h1>

                <p className="mt-2 text-sm font-semibold leading-6 text-[color:var(--muted)]">
                  Keep track of project conversations, feedback, and recruiter
                  chats.
                </p>
              </div>
            </header>

            <div className="mt-7 grid h-[620px] overflow-hidden rounded-[30px] lg:grid-cols-[360px_1fr]">
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
        </AppCard>
      </section>
    </DashboardLayout>
  );
}