import ChatItem from "./ChatItem";
import { useState } from "react";
import { Search, MessageCircle } from "lucide-react";
import { getChatDisplayMeta, getCurrentUser } from "@/data/demoStore";

export default function ChatSidebar({
  chats,
  selectedChatId,
  setSelectedChatId,
}) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const currentUser = getCurrentUser();

  const filteredChats = chats.filter((chat) => {
    const displayChat = getChatDisplayMeta(chat, currentUser?.id);
    const query = search.toLowerCase().trim();
    const isUnread = (chat.unreadBy || []).includes(currentUser?.id);

    if (filter === "unread" && !isUnread) return false;

    if (!query) return true;

    return (
      displayChat.name.toLowerCase().includes(query) ||
      String(chat.name || "").toLowerCase().includes(query)
    );
  });

  const unreadCount = chats.filter((chat) =>
    (chat.unreadBy || []).includes(currentUser?.id)
  ).length;

  return (
    <aside className="flex h-full min-h-0 flex-col border-r border-[color:var(--border-soft)] bg-transparent pr-4">
      <div className="shrink-0 space-y-4 p-5 pl-0">
        <div>
          <h2 className="text-xl font-black text-[color:var(--ink)]">
            Conversations
          </h2>

          <p className="mt-1 text-xs font-semibold text-[color:var(--muted)]">
            {chats.length} conversation{chats.length === 1 ? "" : "s"}
          </p>
        </div>

        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--muted)]" />

          <input
            type="text"
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-[color:var(--border-soft)] bg-[var(--surface)] py-3 pl-11 pr-4 text-sm font-semibold text-[color:var(--ink)] shadow-sm outline-none transition focus:border-[color:var(--gold)] focus:outline-none focus:ring-0 focus:shadow-[0_0_0_4px_rgba(230,199,123,0.22)]"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 rounded-2xl border border-[color:var(--border-soft)] bg-[var(--surface)] p-1.5 shadow-sm">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`rounded-xl px-3 py-2 text-xs font-black transition ${
              filter === "all"
                ? "bg-[linear-gradient(135deg,rgba(230,199,123,0.34),rgba(230,199,123,0.16))] text-[color:var(--ink)] shadow-sm"
                : "text-[color:var(--muted)] hover:bg-[var(--surface-strong)] hover:text-[color:var(--ink)]"
            }`}
          >
            All
          </button>

          <button
            type="button"
            onClick={() => setFilter("unread")}
            className={`rounded-xl px-3 py-2 text-xs font-black transition ${
              filter === "unread"
                ? "bg-[linear-gradient(135deg,rgba(230,199,123,0.34),rgba(230,199,123,0.16))] text-[color:var(--ink)] shadow-sm"
                : "text-[color:var(--muted)] hover:bg-[var(--surface-strong)] hover:text-[color:var(--ink)]"
            }`}
          >
            Unread {unreadCount > 0 ? unreadCount : ""}
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto px-3 pb-4 pl-0">
        {filteredChats.length === 0 ? (
          <div className="flex min-h-[260px] flex-col items-center justify-center rounded-[26px] border border-[color:var(--border-soft)] bg-[var(--surface)] px-5 py-8 text-center shadow-sm">
            <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl border border-[color:var(--gold)]/25 bg-[color:var(--gold)]/10 text-[color:var(--gold)]">
              <MessageCircle className="h-6 w-6" />
            </div>

            <h3 className="text-sm font-black text-[color:var(--ink)]">
              No conversations found
            </h3>

            <p className="mt-2 text-xs font-semibold leading-5 text-[color:var(--muted)]">
              Try another search or check a different filter.
            </p>
          </div>
        ) : (
          filteredChats.map((chat) => (
            <ChatItem
              key={chat.id}
              chat={chat}
              isActive={String(chat.id) === String(selectedChatId)}
              onClick={() => setSelectedChatId(chat.id)}
            />
          ))
        )}
      </div>
    </aside>
  );
}