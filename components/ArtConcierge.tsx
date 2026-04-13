"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { getConciergeResponse } from '../app/actions/chat';

type Message = {
  role: 'user' | 'concierge';
  text: string;
  artworks?: any[];
};

export default function ArtConcierge() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'concierge', text: 'Welcome. I am your personal art concierge. How can I help you find the perfect piece today?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      // Simulate a slight AI "thinking" delay for a premium feel
      await new Promise(resolve => setTimeout(resolve, 800));
      const response = await getConciergeResponse(userMsg);
      
      setMessages(prev => [...prev, { 
        role: 'concierge', 
        text: response.text, 
        artworks: response.artworks 
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'concierge', text: 'Pardon me, I seem to be having trouble accessing the collection right now.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* FLOATING BUTTON */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-8 right-8 w-14 h-14 bg-[#2C2926] text-[#FAF9F6] rounded-full shadow-xl flex items-center justify-center hover:scale-105 transition-transform z-50 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
      >
        {/* Subtle Sparkle Icon */}
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
        </svg>
      </button>

      {/* SLIDE OUT PANEL */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-[#F9F7F2] shadow-2xl z-[100] transform transition-transform duration-500 ease-in-out flex flex-col border-l border-[#E5E1DA] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-[#E5E1DA] bg-[#F2EFE9]">
          <div>
            <h3 className="font-serif italic text-xl text-[#2C2926]">Concierge</h3>
            <p className="text-[9px] uppercase tracking-widest text-[#8C847C] font-bold">ArtisanAlley Assistant</p>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-[#8C847C] hover:text-[#2C2926] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              
              <div className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user' 
                ? 'bg-[#2C2926] text-[#FAF9F6] rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl' 
                : 'bg-[#F2EFE9] border border-[#E5E1DA] text-[#4A443F] rounded-tr-2xl rounded-bl-2xl rounded-br-2xl'
              }`}>
                {msg.text}
              </div>

              {/* Artwork Cards if the AI found matches */}
              {msg.artworks && msg.artworks.length > 0 && (
                <div className="flex flex-col gap-3 mt-3 w-[85%]">
                  {msg.artworks.map(art => (
                    <Link href={`/collection/${art.id}`} key={art.id} onClick={() => setIsOpen(false)}>
                      <div className="flex gap-3 bg-[#FAF9F6] border border-[#E5E1DA] p-2 hover:border-[#8C847C] transition-colors cursor-pointer group">
                        <div className="w-16 h-16 bg-[#F2EFE9] flex-shrink-0 overflow-hidden">
                          {art.imageUrl && <img src={art.imageUrl} alt={art.title} className="w-full h-full object-cover mix-multiply group-hover:scale-105 transition-transform" />}
                        </div>
                        <div className="flex flex-col justify-center">
                          <h4 className="font-serif text-[#2C2926] text-sm line-clamp-1">{art.title}</h4>
                          <p className="text-[9px] uppercase tracking-widest text-[#8C847C] mt-1">₹{art.price}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-start">
              <div className="bg-[#F2EFE9] border border-[#E5E1DA] px-4 py-3 rounded-tr-2xl rounded-bl-2xl rounded-br-2xl flex gap-1">
                <span className="w-1.5 h-1.5 bg-[#8C847C] rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-[#8C847C] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-1.5 h-1.5 bg-[#8C847C] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-[#F9F7F2] border-t border-[#E5E1DA]">
          <form onSubmit={handleSend} className="relative">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe what you're looking for..." 
              className="w-full bg-[#F2EFE9] border border-[#E5E1DA] text-[#4A443F] text-sm px-4 py-3 pr-12 focus:outline-none focus:border-[#8C847C] transition-colors placeholder:text-[#A69F96]"
            />
            <button 
              type="submit" 
              disabled={!input.trim()}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-[#2C2926] hover:text-[#8C847C] transition-colors disabled:opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
          </form>
        </div>
      </div>

      {/* Background Overlay (Mobile only) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-[#2C2926]/20 backdrop-blur-sm z-[90] sm:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}