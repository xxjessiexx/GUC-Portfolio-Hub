import ChatHeader from "./ChatHeader";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";

export default function ChatWindow({
  selectedChat,
  chats,
  setChats,
}) {

  // SEND MESSAGE FUNCTION
  const handleSendMessage = (text) => {

    if (!text.trim()) return;

    const newMessage = {
      id: Date.now(),
      text,
      sender: "me",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const updatedChats = chats.map((chat) => {

      if (chat.id === selectedChat.id) {

        return {
          ...chat,
          messages: [...chat.messages, newMessage],
        };
      }

      return chat;
    });

    setChats(updatedChats);
  };

  return (
    <div className="flex flex-1 flex-col">

      <ChatHeader selectedChat={selectedChat} />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-[#f8f8f8] p-8">

        <div className="flex flex-col gap-6">

          {selectedChat.messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
            />
          ))}

        </div>

      </div>

      <MessageInput onSend={handleSendMessage} />

    </div>
  );
}