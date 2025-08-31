// src/pages/codingPage/ChatMessage.jsx

import React from 'react';
import { User, Cpu, Loader2 } from 'lucide-react';

const ChatMessage = ({ message, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex items-start gap-3 max-w-[90%] self-start">
        <div className="flex items-center justify-center h-8 w-8 rounded-full mt-1 flex-shrink-0 bg-yellow-500 text-white">
          <Cpu size={20} />
        </div>
        <div className="p-3 rounded-lg text-sm leading-relaxed bg-[#333] text-[#d4d4d4] rounded-bl-sm">
          <div className="flex items-center justify-center gap-1 p-1">
             <Loader2 className="animate-spin" size={20}/>
          </div>
        </div>
      </div>
    );
  }

  if (!message) return null;

  const isUser = message.role === 'user';
  const roleClass = isUser ? 'self-end flex-row-reverse' : 'self-start';
  const bubbleClass = isUser ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-[#333] text-[#d4d4d4] rounded-bl-sm';
  const avatarClass = isUser ? 'bg-blue-600 text-white' : 'bg-yellow-500 text-white';
  const Icon = isUser ? User : Cpu;

  return (
    <div className={`flex items-start gap-3 max-w-[90%] ${roleClass}`}>
        <div className={`flex items-center justify-center h-8 w-8 rounded-full mt-1 flex-shrink-0 ${avatarClass}`}>
            <Icon size={20} />
        </div>
        <div className={`p-3 rounded-lg text-sm leading-relaxed ${bubbleClass}`}>
            <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
    </div>
  );
};

export default ChatMessage;

