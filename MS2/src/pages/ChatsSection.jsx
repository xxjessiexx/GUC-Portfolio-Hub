import DashboardLayout from "@/components/layout/DashboardLayout";
import { useState, useEffect } from "react";
import { dummyChats } from "../data/dummyChats";

import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatWindow from "@/components/chat/ChatWindow";

export default function ChatsSection(){
      // ALL chats state


const [chats, setChats] = useState(() => {

  const savedChats =
    JSON.parse(sessionStorage.getItem("chats")) || [];

  // merge dummy chats with saved chats
  return dummyChats.map((dummyChat) => {

    // find same chat in localStorage
    const savedChat = savedChats.find(
      (chat) => chat.id === dummyChat.id
    );

    // if saved version exists use it
    if (savedChat) {
      return savedChat;
    }

    // otherwise use original dummy
    return dummyChat;
  });
});

  // selected user/chat, initially none
  const [selectedChatId, setSelectedChatId] = useState(null);

  useEffect(() => {
  setSelectedChatId(null);
}, []);
  
  useEffect(() => {

  sessionStorage.setItem(
    "chats",
    JSON.stringify(chats)
  );

}, [chats]);

  // current selected chat object
  const selectedChat = chats.find(
    (chat) => chat.id === selectedChatId
  );
  useEffect(() => {

  setChats((prev) =>
    prev.map((chat) => {
      if (chat.id === selectedChatId) {
        return {
          ...chat,
          unread: 0,
        };
      }
      return chat;
    })
  );

}, [selectedChatId]);
    return(
    <DashboardLayout >
    <div className="flex h-[calc(100vh-75px)] p-6">

    <div className="flex w-full overflow-hidden rounded-3xl bg-white shadow-lg">

        <ChatSidebar
          chats={chats}
          selectedChatId={selectedChatId}
          setSelectedChatId={setSelectedChatId}
        />

        <ChatWindow
          chats={chats}
          setChats={setChats}
          selectedChat={selectedChat}
        />

      </div>
    </div>
    </DashboardLayout>
  );
}