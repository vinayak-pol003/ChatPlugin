'use client'
import React, { useState, useRef, useEffect } from 'react';
import { HiOutlinePaperAirplane } from 'react-icons/hi';
import TypingIndicator from './TypingIndicator';

interface Message {
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ChatbotWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! How can I help you?", sender: "bot", timestamp: new Date() },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage = input;
    setMessages([...messages, { text: userMessage, sender: "user", timestamp: new Date() }]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();

      if (data.reply) {
        setMessages((msgs) => [...msgs, { text: data.reply, sender: "bot", timestamp: new Date() }]);
      } else {
        setMessages((msgs) => [...msgs, { text: "Sorry, I couldn't get a response.", sender: "bot", timestamp: new Date() }]);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages((msgs) => [...msgs, { text: "Sorry, something went wrong.", sender: "bot", timestamp: new Date() }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed top-6 right-6 bg-pink-500 text-white rounded-full px-6 py-3 shadow-lg z-50 hover:bg-pink-600 transition-colors"
        >
          Chat
        </button>
      )}
      {open && (
        <div className="fixed top-6 right-6 w-120 h-[650px] bg-white rounded-xl shadow-2xl flex flex-col z-50 overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center p-4 bg-linear-to-r from-pink-500 to-pink-600 text-white rounded-t-xl">
            <span className="font-semibold">Chat Support</span>
            <button onClick={() => setOpen(false)} className="font-bold text-2xl hover:opacity-80 transition">×</button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === "bot" ? "justify-start" : "justify-end"}`}>
                <div className={`flex flex-col ${msg.sender === "bot" ? "items-start" : "items-end"}`}>
                  <span className={`inline-block px-4 py-2 rounded-lg max-w-xs ${msg.sender === "bot" ? "bg-gray-700 text-white rounded-bl-none" : "bg-pink-500 text-white rounded-br-none"}`}>
                    {msg.text}
                  </span>
                  <span className="text-xs text-gray-500 mt-1 px-1">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-700 text-white px-4 py-2 rounded-lg rounded-bl-none">
                  <TypingIndicator />
                </div>
              </div>
            )}
            {/* This div ensures auto-scroll to bottom */}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t bg-white">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !loading && handleSend()}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-black focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                placeholder="Type your message..."
                disabled={loading}
              />
              <button 
                onClick={handleSend} 
                disabled={loading}
                className="bg-pink-500 text-white px-4 rounded-lg hover:bg-pink-600 disabled:opacity-50 transition-colors"
              >
                <HiOutlinePaperAirplane size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotWidget;
