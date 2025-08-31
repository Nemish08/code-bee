// src/pages/codingPage/AITutor.jsx

import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2, Code, MessageSquare, BrainCircuit } from 'lucide-react';
import { fetchConversation, sendMessageToTutor } from '../../utils/tutorService';
import ChatMessage from './ChatMessage';
import { useUser } from "@clerk/clerk-react";
import { useCode } from '../../context/CodeContext';

const AITutor = ({ problemId, problem }) => {
    const { user } = useUser();
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [sendWithCode, setSendWithCode] = useState(true);
    const chatBottomRef = useRef(null);
    const { myCode } = useCode();

    const welcomeMessage = {
        role: 'assistant',
        content: `Hello! I'm CodeBee, your AI Tutor. Ask me for a hint, an explanation, or to check your logic. How can I help you with "${problem.title}"?`,
        createdAt: new Date().toISOString()
    };

    useEffect(() => {
        if (!problemId) return;

        setIsLoading(true);
        fetchConversation(problemId, user.id)
            .then(history => {
                setMessages(history.length > 0 ? history : [welcomeMessage]);
            })
            .catch(err => {
                console.error(err);
                setError('Could not load chat history.');
                setMessages([welcomeMessage]);
            })
            .finally(() => setIsLoading(false));
    }, [problemId, user.id]);

    useEffect(() => {
        chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userInput.trim() || isLoading) return;

        const userMessage = { role: 'user', content: userInput.trim(), createdAt: new Date().toISOString() };
        
        setMessages(prev => [...prev, userMessage]);
        setUserInput('');
        setIsLoading(true);
        setError(null);

        try {
            const problemWithCodeContext = {
                ...problem,
                myCode: sendWithCode ? myCode : "The user chose not to send their code."
            };

            const aiMessage = await sendMessageToTutor(problemId, userMessage.content, user.id, problemWithCodeContext);
            
            setMessages(prev => [...prev, aiMessage]);
        } catch (err) {
            console.error(err);
            setError('CodeBee is busy, please try again in a moment.');
            setMessages(prev => prev.slice(0, -1)); 
        } finally {
            setIsLoading(false);
        }
    };

    return (
      <div className="flex flex-col h-100% w-full bg-[#1e1e1e] text-[#d4d4d4] rounded-b-lg">
          {/* Header */}
          <div className="flex items-center gap-3 p-3 border-b border-[#333] flex-shrink-0 bg-[#252526] rounded-t-lg">
              <BrainCircuit size={24} className="text-yellow-400" />
              <h2 className="font-bold text-lg text-white">AI Tutor</h2>
              <span className="text-xs font-medium bg-green-900/50 text-green-400 border border-green-500 px-2 py-0.5 rounded-full">Online</span>
          </div>

          {/* Chat Area - This is the key change for scrolling */}
          <div className="flex-grow p-4 flex flex-col gap-4 overflow-y-auto">
              {isLoading && messages.length <= 1 && (
                  <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-500">
                      <Loader2 className="animate-spin text-yellow-400" size={32} />
                      <p>Waking up CodeBee...</p>
                  </div>
              )}

              {messages.map((msg, index) => (
                  <ChatMessage key={index} message={msg} />
              ))}

              {isLoading && messages.length > 0 && messages[messages.length - 1]?.role === 'user' && (
                  <ChatMessage isLoading={true} />
              )}
              
              <div ref={chatBottomRef} />
          </div>
          
          {error && <p className="text-center text-red-400 text-xs px-4 pb-2">{error}</p>}

          {/* Input Area */}
          <div className="p-4 border-t border-[#333] bg-[#252526] flex-shrink-0">
              <form onSubmit={handleSubmit}>
                  <div className="relative flex items-center">
                      <MessageSquare size={20} className="absolute left-3 text-gray-400" />
                      <input
                          type="text"
                          value={userInput}
                          onChange={(e) => setUserInput(e.target.value)}
                          placeholder="Ask for a hint or explanation..."
                          className="w-full bg-[#3c3c3c] border border-[#555] rounded-lg p-2.5 pr-12 pl-10 text-[#d4d4d4] focus:outline-none focus:ring-2 focus:ring-yellow-500"
                          disabled={isLoading}
                      />
                      <button
                          type="submit"
                          className="absolute right-2.5 flex items-center justify-center h-8 w-8 bg-yellow-500 text-white rounded-md transition-colors hover:bg-yellow-600 disabled:bg-gray-600 disabled:cursor-not-allowed"
                          disabled={!userInput.trim() || isLoading}
                      >
                          {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                      </button>
                  </div>
              </form>
              <div className="flex items-center mt-3">
                  <input
                      type="checkbox"
                      id="sendWithCode"
                      checked={sendWithCode}
                      onChange={(e) => setSendWithCode(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-500 bg-gray-700 cursor-pointer accent-yellow-500"
                  />
                  <label htmlFor="sendWithCode" className="flex items-center gap-2 ml-2 text-xs text-gray-400 cursor-pointer">
                      <Code size={14} />
                      <span>Send with current code</span>
                  </label>
              </div>
          </div>
      </div>
    );
};

export default AITutor;