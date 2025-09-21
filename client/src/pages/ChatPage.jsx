import { useChatStore } from "../store/useChatStore";

import AnimatedBorder from "../components/AnimatedBorder";
import ProfileHeader from "../components/ProfileHeader";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ChatsList from "../components/ChatsList ";
import ContactList from "../components/ContactList";
import ChatContainer from "../components/ChatContainer";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";

function ChatPage() {
  const { activeTab, selectedUser } = useChatStore();
  return (
    <div className="relative w-full max-w-6xl h-[800px]">
      <AnimatedBorder>
        {/* LEFT SIDE  */}
        <div className="w-80 bg-slate-800/50 backdrop-blur-sm flex flex-col">
          <ProfileHeader />
          <ActiveTabSwitch />

          <div className="flex-1 overflow-x-auto p-4 space-y-2">
            {activeTab === "chat" ? <ChatsList /> : <ContactList />}
          </div>
        </div>

        {/* Right SIDE */}
        <div className="flex-1 flex flex-col bg-slate-900/50 backdrop-blur-sm">
          {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
        </div>
      </AnimatedBorder>
    </div>
  );
}

export default ChatPage;
