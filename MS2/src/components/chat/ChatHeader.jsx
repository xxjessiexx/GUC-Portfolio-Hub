import { getChatDisplayMeta, getCurrentUser } from "@/data/demoStore";

export default function ChatHeader({ selectedChat }) {
  const currentUser = getCurrentUser();
  const displayChat = getChatDisplayMeta(selectedChat, currentUser?.id);

  return (
    <header className="flex shrink-0 items-center bg-transparent px-6 py-5">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-[linear-gradient(135deg,var(--dark),var(--primary))] text-lg font-black text-white shadow-[var(--shadow-soft)]">
          {displayChat.image ? (
            <img
              src={displayChat.image}
              alt={displayChat.name}
              className="h-full w-full object-cover"
            />
          ) : (
            displayChat.avatar
          )}
        </div>

        <div>
          <h2 className="text-lg font-black text-[color:var(--ink)]">
            {displayChat.name}
          </h2>

          <div className="mt-1 flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${
                displayChat.online
                  ? "bg-emerald-400"
                  : "bg-[color:var(--muted)]/50"
              }`}
            />

            <p className="text-xs font-bold text-[color:var(--muted)]">
              {displayChat.online ? "Online" : "Offline"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}