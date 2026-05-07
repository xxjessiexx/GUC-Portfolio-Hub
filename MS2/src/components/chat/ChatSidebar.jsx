import ChatItem from "./ChatItem";
import { useState } from "react";

export default function ChatSidebar({
  chats,
  selectedChatId,
  setSelectedChatId,
}) {
    const [search, setSearch] = useState("");

  return (
    <div className="w-[360px] border-r bg-[#fafafa]">

      <div className="p-6">
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

      <div>

        {chats
  .filter((chat) =>
    chat.name.toLowerCase().includes(search.toLowerCase())
  )
  .map((chat) => (
          <ChatItem
            key={chat.id}
            chat={chat}
            isActive={chat.id === selectedChatId}
            onClick={() => setSelectedChatId(chat.id)}
          />
        ))}

      </div>

    </div>
  );
}