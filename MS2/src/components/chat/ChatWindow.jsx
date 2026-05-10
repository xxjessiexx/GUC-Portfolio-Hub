import ChatHeader from "./ChatHeader";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import { useRef, useEffect, useState } from "react";

import {
  addChatMessage,
  addScriptedChatReply,
  getCurrentUser,
} from "@/data/demoStore";

export default function ChatWindow({
  selectedChat,
}) {
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

    // Only Omar Adel / employer chat should auto-reply
    if (selectedChat.id !== "chat-student-employer") return false;

    // Only the student should receive Omar's scripted replies
    if (currentUser?.id !== "student-demo-1") return false;

    const replies = selectedChat.scriptedReplies || [];
    const replyIndex = selectedChat.scriptedReplyIndex || 0;

    return Boolean(replies[replyIndex]);
  };

  const handleSendMessage = (text) => {
    if (!selectedChat) return;
    if (!text.trim()) return;

    addChatMessage(selectedChat.id, text, currentUser?.id);

    if (!shouldUseScriptedReply()) return;

    const replies = selectedChat.scriptedReplies || [];
    const replyIndex = selectedChat.scriptedReplyIndex || 0;
    const nextReply = replies[replyIndex];
    const otherParticipantId = getOtherParticipantId();

    if (!nextReply || !otherParticipantId) return;

    setIsTyping(true);

    window.setTimeout(() => {
      addScriptedChatReply(selectedChat.id, nextReply, otherParticipantId, {
        markAsUnread: false,
        createNotification: false,
      });

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
      <div className="flex flex-1 items-center justify-center bg-[#f8f8f8]">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-700">
            Your Messages
          </h2>

          <p className="mt-3 text-gray-500">
            Select a conversation to start chatting
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <ChatHeader selectedChat={selectedChat} />

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto bg-[#f8f8f8] p-8"
      >
        <div className="flex flex-col gap-6">
          {(selectedChat.messages || []).map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              currentUserId={currentUser?.id}
            />
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-center gap-1 rounded-3xl bg-[#ececec] px-5 py-4">
                <span className="h-2 w-2 animate-bounce rounded-full bg-gray-500 [animation-delay:-0.2s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-gray-500 [animation-delay:-0.1s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-gray-500" />
              </div>
            </div>
          )}
        </div>
      </div>

      <MessageInput onSend={handleSendMessage} />
    </div>
  );
}