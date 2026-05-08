import ChatHeader from "./ChatHeader";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import { useState, useRef, useEffect } from "react";

export default function ChatWindow({
selectedChat,
chats,
setChats,
}) {

    const messagesContainerRef = useRef(null);

  // SEND MESSAGE FUNCTION
const handleSendMessage = (text) => {
    if (!selectedChat) return;


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
    // ONLY Fatima gets replies
if (selectedChat.id === 3) {
sendScriptedReply(updatedChats);
}
};
const [isTyping, setIsTyping] = useState(false);

useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    container.scrollTo({
    top: container.scrollHeight,
    behavior: "smooth",
});
}, [selectedChat?.messages, isTyping]);


const sendScriptedReply = (currentChats) => {

setIsTyping(true);

setTimeout(() => {

    const currentChat = currentChats.find(
    (chat) => chat.id === selectedChat.id
    );

    const currentReply =
    currentChat.scriptedReplies[
        currentChat.replyIndex
    ];

    if (!currentReply) {
    setIsTyping(false);
    return;
    }

    const replyMessage = {
    id: Date.now(),
    text: currentReply,
    sender: "other",
    time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    }),
    };

    const updatedChats = currentChats.map((chat) => {

    if (chat.id === selectedChat.id) {

        return {
        ...chat,

        messages: [
            ...chat.messages,
            replyMessage,
        ],

        replyIndex: chat.replyIndex + 1,
        };
    }

    return chat;
    });

    setChats(updatedChats);

    setIsTyping(false);

}, 2000);
};
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

{selectedChat.messages.map((message) => (
    <MessageBubble
    key={message.id}
    message={message}
    />
))}

{isTyping && (
<div className="flex justify-start">
    <div className="flex items-center gap-1 rounded-3xl bg-gray-200 px-5 py-3">
    <span className="h-2 w-2 animate-bounce rounded-full bg-gray-500 [animation-delay:-0.2s]"></span>
    <span className="h-2 w-2 animate-bounce rounded-full bg-gray-500 [animation-delay:-0.1s]"></span>
    <span className="h-2 w-2 animate-bounce rounded-full bg-gray-500"></span>
    </div>
</div>
)}


</div>
    </div>

    <MessageInput onSend={handleSendMessage} />

    </div>
);
}