import { useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";

import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

import MessagesLoadingSkeloton from "./MessagesLoadingSkeleton";
import NoChatHistoryPlaceHolder from "./NoChatHistoryPlaceholder";
import MessageInput from "./MessageInput";

function ChatContainer() {
  const { selectedUser, messages, getMessagesByUserId, isMessagesLoading } = useChatStore();
  const { authUser } = useAuthStore();
  const messageRef = useRef(null);
  const prevMessagesLength = useRef(messages.length);

  useEffect(() => {
    if (selectedUser) {
      getMessagesByUserId(selectedUser._id);
    }
  }, [selectedUser, getMessagesByUserId]);

  useEffect(() => {
    // Only scroll if a new message is added to the end
    if (messages.length > prevMessagesLength.current) {
      if (messageRef.current) {
        messageRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
    prevMessagesLength.current = messages.length;
  }, [messages]);

  return (
    <>
      <ChatHeader />
      <div className="flex-1 overflow-y-auto px-6 py-8">
        {messages.length > 0 && !isMessagesLoading ? (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`chat ${msg.senderId === authUser._id ? "chat-end" : "chat-start"}`}
              >
                <div
                  className={`chat-bubble relative ${
                    msg.senderId === authUser._id
                      ? "bg-cyan-500 text-white"
                      : "bg-slate-800 text-slate-200"
                  }`}
                >
                  {msg.image && (
                    <img src={msg.image} alt="shared" className="rounded-lg h-48 object-cover" />
                  )}
                  {msg.text && <p className="mt-2">{msg.text}</p>}
                  <p className="text-xs mt-1 opacity-75 flex items-center gap-1">
                    {new Date(msg.createdAt).toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messageRef} />
          </div>
        ) : isMessagesLoading ? (
          <MessagesLoadingSkeloton />
        ) : (
          <NoChatHistoryPlaceHolder name={selectedUser.fullName} />
        )}
      </div>
      <MessageInput />
    </>
  );
}

export default ChatContainer;
