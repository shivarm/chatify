import { useEffect } from 'react';
import ChatHeader from './ChatHeader';

import { useAuthStore } from '../store/useAuthStore';
import { useChatStore } from '../store/useChatStore';


function ChatContainer() {
  const { selectedUser, getMessagesByUserId } = useChatStore();
  const { authUser } = useAuthStore();

  useEffect(() => {
    if (selectedUser) {
      getMessagesByUserId(selectedUser._id);
    }
  }, [selectedUser, getMessagesByUserId]);

  if (!selectedUser) return null;

  return (
    <>
      <ChatHeader />
       
    </>
  );
}

export default ChatContainer;