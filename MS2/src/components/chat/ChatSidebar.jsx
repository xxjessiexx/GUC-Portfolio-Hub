import ChatItem from "./ChatItem";
import { useState } from "react";
import {
  getChatDisplayMeta,
  getCurrentUser,
} from "@/data/demoStore";

export default function ChatSidebar({
  chats,
  selectedChatId,
  setSelectedChatId,
}) {
  const [search, setSearch] = useState("");
  const currentUser = getCurrentUser();

  const filteredChats = chats.filter((chat) => {
    const displayChat = getChatDisplayMeta(chat, currentUser?.id);
    const query = search.toLowerCase().trim();

    if (!query) return true;

    return (
      displayChat.name.toLowerCase().includes(query) ||
      String(chat.name || "").toLowerCase().includes(query)
    );
  });

  return (
    <div className="flex h-full min-h-0 w-[360px] flex-col border-r bg-[#fafafa]">
      <div className="shrink-0 p-6">
        <h1 className="text-3xl font-bold text-[var(--ink)]">
          Messages
        </h1>

        <input
          type="text"
          placeholder="Search conversations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mt-6 w-full rounded-xl border p-3 outline-none"
        />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        {filteredChats.map((chat) => (
          <ChatItem
            key={chat.id}
            chat={chat}
            isActive={String(chat.id) === String(selectedChatId)}
            onClick={() => setSelectedChatId(chat.id)}
          />
        ))}
      </div>
    </div>
  );
}
