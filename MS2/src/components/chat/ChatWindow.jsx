import ChatHeader from "./ChatHeader";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import { useRef, useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";

import {
  addChatMessage,
  addScriptedChatReply,
  getCurrentUser,
  getOrCreateDirectChat,
  markChatAsRead,
} from "@/data/demoStore";

export default function ChatWindow({ selectedChat, onCreatedChat }) {
  const messagesContainerRef = useRef(null);
  const currentUser = getCurrentUser();

  const [isTyping, setIsTyping] = useState(false);

  const getOtherParticipantId = () => {
    return (selectedChat?.participantIds || []).find(
      (participantId) => String(participantId) !== String(currentUser?.id)
    );
  };

  const shouldUseScriptedReply = () => {
    if (!selectedChat) return false;

    if (selectedChat.id !== "chat-student-employer") return false;

    if (currentUser?.id !== "student-demo-1") return false;

    const replies = selectedChat.scriptedReplies || [];
    const replyIndex = selectedChat.scriptedReplyIndex || 0;

    return Boolean(replies[replyIndex]);
  };

  const handleSendMessage = (text, attachments = []) => {
  if (!selectedChat) return;
  if (!text.trim() && attachments.length === 0) return;

  let activeChat = selectedChat;

  if (selectedChat.isDraft) {
    activeChat = getOrCreateDirectChat(
      selectedChat.targetUserId,
      currentUser?.id
    );

    if (!activeChat?.id) return;

    onCreatedChat?.(activeChat.id);
  }

  addChatMessage(activeChat.id, text, currentUser?.id, { attachments });

  if (!shouldUseScriptedReply()) return;

  const replies = activeChat.scriptedReplies || [];
  const replyIndex = activeChat.scriptedReplyIndex || 0;
  const nextReply = replies[replyIndex];
  const otherParticipantId = getOtherParticipantId();

  if (!nextReply || !otherParticipantId) return;

  setIsTyping(true);

window.setTimeout(() => {
  markChatAsRead(
    activeChat.id,
    otherParticipantId
  );

  addScriptedChatReply(
    activeChat.id,
    nextReply,
    otherParticipantId,
    {
      markAsUnread: false,
      createNotification: false,
    }
  );

  setIsTyping(false);
}, 1800);
};

  useEffect(() => {
    setIsTyping(false);
  }, [selectedChat?.id]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  }, [selectedChat?.id, selectedChat?.messages?.length, isTyping]);

  if (!selectedChat) {
    return (
      <section className="flex h-full min-h-0 flex-1 bg-[linear-gradient(145deg,rgba(211,235,248,0.54),rgba(241,249,253,0.34))] p-5 shadow-[inset_10px_0_28px_rgba(56,101,126,0.035)] sm:p-7 lg:p-9">
        <div className="flex h-full w-full items-center justify-center rounded-[26px] border border-dashed border-white/70 bg-[rgba(255,255,255,0.30)] shadow-[inset_0_1px_0_rgba(255,255,255,0.7),inset_0_0_36px_rgba(92,145,176,0.035)]">
          <div className="max-w-sm text-center">
            <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-3xl border border-[color:var(--gold)]/25 bg-[color:var(--gold)]/10 text-[color:var(--gold)] shadow-[0_16px_38px_rgba(230,199,123,0.14)]">
              <MessageCircle className="h-7 w-7" />
            </div>

            <h2 className="text-xl font-black text-[color:var(--ink)]">
              Select a conversation
            </h2>

            <p className="mt-2 text-sm font-semibold leading-6 text-[color:var(--muted)]">
              Choose a chat from the left to view messages and continue your
              project conversations.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="flex h-full min-h-0 flex-1 flex-col bg-[rgba(244,250,253,0.34)] shadow-[inset_10px_0_28px_rgba(56,101,126,0.028)]">
      <ChatHeader selectedChat={selectedChat} />

      <div
        ref={messagesContainerRef}
        className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden border-y border-white/50 bg-[linear-gradient(145deg,rgba(199,228,244,0.46),rgba(231,244,251,0.26)_42%,rgba(255,255,255,0.22))] px-6 py-7 shadow-[inset_0_12px_24px_rgba(43,84,108,0.035),inset_0_-10px_20px_rgba(43,84,108,0.025)] sm:px-7 lg:px-8"
      >
        <div className="flex min-w-0 flex-col gap-4">
          <div className="mx-auto mb-2 rounded-full border border-white/75 bg-[rgba(255,255,255,0.78)] px-4 py-1.5 text-xs font-black text-[color:var(--muted)] shadow-[0_7px_18px_rgba(45,87,111,0.07),inset_0_1px_0_rgba(255,255,255,0.94)] backdrop-blur-sm">
            Today
          </div>

          {(selectedChat.messages || []).map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              currentUserId={currentUser?.id}
            />
          ))}

          {selectedChat.isDraft && (
            <div className="mx-auto rounded-full border border-dashed border-[color:var(--border-soft)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[color:var(--muted)]">
              Send a message to start this conversation.
            </div>
          )}

          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-center gap-1 rounded-3xl border border-white/80 bg-[rgba(255,255,255,0.88)] px-5 py-4 shadow-[0_10px_24px_rgba(45,87,111,0.10),inset_0_1px_0_rgba(255,255,255,0.96)]">
                <span className="h-2 w-2 animate-bounce rounded-full bg-[color:var(--muted)] [animation-delay:-0.2s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-[color:var(--muted)] [animation-delay:-0.1s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-[color:var(--muted)]" />
              </div>
            </div>
          )}
        </div>
      </div>

      <MessageInput onSend={handleSendMessage} />
    </section>
  );
}