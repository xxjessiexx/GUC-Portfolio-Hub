import { useEffect, useMemo, useState } from "react";
import {
  MessageCircle,
  Search,
} from "lucide-react";

import ChatItem from "./ChatItem";

import {
  getChatDisplayMeta,
  getCurrentUser,
} from "@/data/demoStore";

function getPinnedStorageKey(userId) {
  return `guc-pinned-chats:${String(userId || "guest")}`;
}

function readPinnedChatIds(userId) {
  try {
    const raw = localStorage.getItem(
      getPinnedStorageKey(userId)
    );

    const parsed = raw ? JSON.parse(raw) : [];

    return Array.isArray(parsed)
      ? parsed.map(String)
      : [];
  } catch {
    return [];
  }
}

function writePinnedChatIds(userId, ids) {
  localStorage.setItem(
    getPinnedStorageKey(userId),
    JSON.stringify(ids.map(String))
  );
}

export default function ChatSidebar({
  chats,
  selectedChatId,
  setSelectedChatId,
}) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const currentUser = getCurrentUser();

  const [pinnedChatIds, setPinnedChatIds] = useState(
    () => readPinnedChatIds(currentUser?.id)
  );

  useEffect(() => {
    setPinnedChatIds(
      readPinnedChatIds(currentUser?.id)
    );
  }, [currentUser?.id]);

  const pinnedSet = useMemo(
    () => new Set(pinnedChatIds.map(String)),
    [pinnedChatIds]
  );

  const filteredChats = useMemo(() => {
    const query = search.toLowerCase().trim();

    const matchingChats = chats.filter((chat) => {
      const displayChat = getChatDisplayMeta(
        chat,
        currentUser?.id
      );

      const isUnread = (chat.unreadBy || []).includes(
        currentUser?.id
      );

      if (filter === "unread" && !isUnread) {
        return false;
      }

      if (!query) {
        return true;
      }

      return (
        displayChat.name
          .toLowerCase()
          .includes(query) ||
        String(chat.name || "")
          .toLowerCase()
          .includes(query)
      );
    });

    /*
      Pinned chats always come first.

      The original order inside each group is preserved,
      so we do not disturb the existing conversation ordering.
    */
    return [...matchingChats].sort((a, b) => {
      const aPinned = pinnedSet.has(
        String(a.id)
      )
        ? 1
        : 0;

      const bPinned = pinnedSet.has(
        String(b.id)
      )
        ? 1
        : 0;

      return bPinned - aPinned;
    });
  }, [
    chats,
    search,
    filter,
    currentUser?.id,
    pinnedSet,
  ]);

  const unreadCount = chats.filter((chat) =>
    (chat.unreadBy || []).includes(currentUser?.id)
  ).length;

  const handleTogglePin = (chat) => {
    const chatId = String(chat.id);

    const isPinned =
      pinnedChatIds.includes(chatId);

    const nextPinnedIds = isPinned
      ? pinnedChatIds.filter(
          (id) => id !== chatId
        )
      : [...pinnedChatIds, chatId];

    setPinnedChatIds(nextPinnedIds);

    writePinnedChatIds(
      currentUser?.id,
      nextPinnedIds
    );
  };

  return (
    <aside className="relative z-10 flex h-full min-h-0 flex-col border-r border-white/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.76),rgba(238,248,253,0.58))] shadow-[8px_0_24px_rgba(43,84,108,0.06),inset_-1px_0_0_rgba(120,164,188,0.08)] backdrop-blur-md">
      <div className="shrink-0 space-y-4 p-5 sm:p-6">
        <div>
          <h2 className="text-xl font-black text-[color:var(--ink)]">
            Conversations
          </h2>

          <p className="mt-1 text-xs font-semibold text-[color:var(--muted)]">
            {chats.length} conversation
            {chats.length === 1 ? "" : "s"}
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--muted)]" />

          <input
            type="text"
            placeholder="Search conversations..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            className="w-full rounded-2xl border border-white/80 bg-[rgba(255,255,255,0.82)] py-3 pl-11 pr-4 text-sm font-semibold text-[color:var(--ink)] shadow-[0_8px_22px_rgba(45,87,111,0.07),inset_0_1px_0_rgba(255,255,255,0.95)] outline-none transition focus:border-[color:var(--gold)] focus:outline-none focus:ring-0 focus:shadow-[0_0_0_4px_rgba(230,199,123,0.18),0_10px_26px_rgba(45,87,111,0.09)]"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 gap-2 rounded-2xl border border-white/70 bg-[rgba(255,255,255,0.56)] p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_6px_18px_rgba(45,87,111,0.04)]">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`rounded-xl px-3 py-2 text-xs font-black transition ${
              filter === "all"
                ? "bg-[linear-gradient(135deg,rgba(245,222,163,0.60),rgba(236,205,128,0.28))] text-[color:var(--ink)] shadow-[0_6px_14px_rgba(188,151,63,0.12),inset_0_1px_0_rgba(255,255,255,0.72)]"
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
                ? "bg-[linear-gradient(135deg,rgba(245,222,163,0.60),rgba(236,205,128,0.28))] text-[color:var(--ink)] shadow-[0_6px_14px_rgba(188,151,63,0.12),inset_0_1px_0_rgba(255,255,255,0.72)]"
                : "text-[color:var(--muted)] hover:bg-[var(--surface-strong)] hover:text-[color:var(--ink)]"
            }`}
          >
            Unread {unreadCount > 0 ? unreadCount : ""}
          </button>
        </div>
      </div>

      {/* Chat list */}
      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto px-3 pb-5 sm:px-4">
        {filteredChats.length === 0 ? (
          <div className="flex min-h-[260px] flex-col items-center justify-center rounded-[26px] border border-[color:var(--border-soft)] bg-[var(--surface)] px-5 py-8 text-center shadow-sm">
            <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl border border-[color:var(--gold)]/25 bg-[color:var(--gold)]/10 text-[color:var(--gold)]">
              <MessageCircle className="h-6 w-6" />
            </div>

            <h3 className="text-sm font-black text-[color:var(--ink)]">
              No conversations found
            </h3>

            <p className="mt-2 text-xs font-semibold leading-5 text-[color:var(--muted)]">
              Try another search or check a
              different filter.
            </p>
          </div>
        ) : (
          filteredChats.map((chat) => (
            <ChatItem
              key={chat.id}
              chat={chat}
              isActive={
                String(chat.id) ===
                String(selectedChatId)
              }
              pinned={pinnedSet.has(
                String(chat.id)
              )}
              onTogglePin={handleTogglePin}
              onClick={() =>
                setSelectedChatId(chat.id)
              }
            />
          ))
        )}
      </div>
    </aside>
  );
}