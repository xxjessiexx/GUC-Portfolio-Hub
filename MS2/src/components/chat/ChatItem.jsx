export default function ChatItem({
  chat,
  isActive,
  onClick,
}) {

  const lastMessage =
    chat.messages[chat.messages.length - 1];

  return (
    <div
      onClick={onClick}
      className={`flex cursor-pointer items-center gap-4 border-b p-5 transition
      ${isActive ? "bg-blue-100" : "hover:bg-gray-50"}
      `}
    >

      {/* Avatar */}
      <div className="relative">

        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--dark),var(--primary))] shadow-[0_18px_55px_rgba(44,57,71,0.22)] text-xl font-bold text-white">
          {chat.avatar}
        </div>

        {chat.unread > 0 && (
          <div className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-[color:var(--gold)] text-xs font-black text-[color:var(--primary)] shadow-[0_8px_18px_rgba(230,199,123,0.35)]">
            {chat.unread}
          </div>
        )}

      </div>

      {/* Info */}
      <div className="flex-1 overflow-hidden">

        <div className="flex items-center justify-between">

          <h2 className="font-semibold">
            {chat.name}
          </h2>

          <span className="text-sm text-gray-400">
            {lastMessage.time}
          </span>

        </div>

        <p className="truncate text-sm text-gray-500">
          {lastMessage.text}
        </p>

      </div>

    </div>
  );
}