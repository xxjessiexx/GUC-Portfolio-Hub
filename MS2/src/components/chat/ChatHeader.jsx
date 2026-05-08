export default function ChatHeader({
  selectedChat,
}) {

  return (
    <div className="flex items-center gap-4 border-b bg-white p-6">

      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--dark),var(--primary))] shadow-[0_18px_55px_rgba(44,57,71,0.22)] font-bold text-white">
        {selectedChat.avatar}
      </div>

      <div>

        <h2 className="text-xl font-semibold">
          {selectedChat.name}
        </h2>

        <p className="text-sm text-green-500">
          {selectedChat.online
            ? "Online"
            : "Offline"}
        </p>

      </div>

    </div>
  );
}