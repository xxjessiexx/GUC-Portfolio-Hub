import ChatItem from "./ChatItem";

export default function ChatSidebar({
  chats,
  selectedChatId,
  setSelectedChatId,
}) {

  return (
    <div className="w-[360px] border-r bg-[#fafafa]">

      <div className="p-6">
        <h1 className="text-3xl font-bold text-[var(--ink)]">
          Messages
        </h1>

        <input
          type="text"
          placeholder="Search conversations..."
          className="mt-6 w-full rounded-xl border p-3 outline-none"
        />
      </div>

      <div>

        {chats.map((chat) => (
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