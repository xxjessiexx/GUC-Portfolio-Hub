import DashboardLayout from "@/components/layout/DashboardLayout";
import { useState } from "react";
import { dummyChats } from "../data/dummyChats";

import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatWindow from "@/components/chat/ChatWindow";

export default function ChatsSection(){
      // ALL chats state
  const [chats, setChats] = useState(dummyChats);

  // selected user/chat
  const [selectedChatId, setSelectedChatId] = useState(1);

  // current selected chat object
  const selectedChat = chats.find(
    (chat) => chat.id === selectedChatId
  );
    return(
    <DashboardLayout >
    <div className="flex h-screen bg-[#f7f7fb] p-6">

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