import React, { useState, useEffect, useRef } from 'react';
import { Chat } from '@google/genai';
import { ChatMessage } from '../types';
import { startChat } from '../services/geminiService';

const Chatbot: React.FC = () => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setChat(startChat());
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [history]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || !chat) return;

    const userMessage: ChatMessage = { role: 'user', parts: [{ text: userInput }] };
    setHistory(prev => [...prev, userMessage]);
    setIsLoading(true);
    setUserInput('');

    try {
        const result = await chat.sendMessageStream({ message: userInput });
        
        let text = '';
        const modelMessage: ChatMessage = { role: 'model', parts: [{ text: '' }] };
        setHistory(prev => [...prev, modelMessage]);

        // FIX: Each chunk is a GenerateContentResponse, access .text property
        for await (const chunk of result) {
            text += chunk.text;
            setHistory(prev => {
                const newHistory = [...prev];
                newHistory[newHistory.length - 1] = { role: 'model', parts: [{ text }] };
                return newHistory;
            });
        }
    } catch (error) {
        console.error("Chat error:", error);
        const errorMessage: ChatMessage = { role: 'model', parts: [{ text: "Xin lỗi, tôi đang gặp sự cố. Vui lòng thử lại sau." }] };
        setHistory(prev => [...prev, errorMessage]);
    } finally {
        setIsLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <h1 className="text-2xl font-bold text-stone-800 p-4 border-b">Trợ lý Dinh dưỡng AI</h1>
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {history.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${msg.role === 'user' ? 'bg-orange-600 text-white' : 'bg-gray-200 text-stone-800'}`}>
              <p className="whitespace-pre-wrap">{msg.parts[0].text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex justify-start">
                <div className="px-4 py-2 rounded-2xl bg-gray-200 text-stone-800">
                    <span className="animate-pulse">...</span>
                </div>
            </div>
        )}
      </div>
      <form onSubmit={handleSendMessage} className="p-4 border-t bg-white">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Hỏi về dinh dưỡng, công thức..."
            className="flex-1 p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading || !userInput.trim()} className="bg-orange-600 text-white rounded-full p-2 disabled:bg-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chatbot;
