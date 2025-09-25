"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Minimize2, Maximize2, GraduationCap, BookOpen, Brain, Sparkles } from "lucide-react";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<
    { sender: "user" | "bot"; text: string; timestamp: Date }[]
  >([
    {
      sender: "bot",
      text: "Hi there! 👋 I'm your AI study buddy. I'm here to help you with your virtual lab experiments, answer science questions, or just chat about learning. What would you like to explore today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [size, setSize] = useState({ width: 380, height: 500 });
  const [isMobile, setIsMobile] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

 const sendMessage = async () => {
  if (!input.trim()) return;

  const newMessage = { sender: "user" as const, text: input, timestamp: new Date() };
  const newMessages = [...messages, newMessage];
  setMessages(newMessages);
  setLoading(true);

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input })
    });

    const data = await res.json();

    setMessages([
      ...newMessages,
      {
        sender: "bot",
        text: data.reply || "Sorry, I didn’t get that.",
        timestamp: new Date()
      }
    ]);
  } catch (error) {
    setMessages([
      ...newMessages,
      { sender: "bot", text: "Error contacting AI API.", timestamp: new Date() }
    ]);
    console.error("ChatBot error:", error);
  }

  setLoading(false);
  setInput("");
};
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMobile) return; // Disable resize on mobile
    
    if (e.target === e.currentTarget) {
      setIsResizing(true);
      const startX = e.clientX;
      const startY = e.clientY;
      const startWidth = size.width;
      const startHeight = size.height;

      const handleMouseMove = (e: MouseEvent) => {
        const newWidth = Math.max(320, Math.min(600, startWidth + (startX - e.clientX)));
        const newHeight = Math.max(400, Math.min(700, startHeight + (startY - e.clientY)));
        setSize({ width: newWidth, height: newHeight });
      };

      const handleMouseUp = () => {
        setIsResizing(false);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Mobile styles
  const mobileStyles = isMobile ? {
  position: 'fixed' as const,
  bottom: 0,
  left: 0,
  width: '100vw',
  height: '80vh',
  borderRadius: '1rem 1rem 0 0',
  zIndex: 9999,
} : {};

  return (
   <div className={`fixed z-50 ${isMobile ? 'bottom-0 right-0' : 'bottom-4 right-4 sm:bottom-6 sm:right-6'}`}>


      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={`group relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-indigo-500/25 hover:scale-110 transition-all duration-300 animate-bounce ${
            isMobile ? 'p-3 fixed bottom-4 right-4' : 'p-4'
          }`}
          style={{ animationDuration: '3s' }}
        >
          <MessageCircle size={isMobile ? 24 : 28} className="group-hover:rotate-12 transition-transform duration-300" />
          <div className={`absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center animate-pulse ${
            isMobile ? 'w-5 h-5' : 'w-6 h-6'
          }`}>
            <Brain size={isMobile ? 10 : 12} className="text-white" />
          </div>
          
          {/* Tooltip */}
          <div className={`absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap ${
            isMobile ? 'hidden' : ''
          }`}>
            Ask your AI study buddy! 🤖
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          ref={chatRef}
          className={`bg-white/95 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden border border-white/20 transition-all duration-500 ${
            isMobile ? 'rounded-none' : 'rounded-2xl'
          } ${
            isMinimized ? (isMobile ? 'h-16' : 'h-16') : ''
          } ${isResizing ? 'select-none' : ''}`}
          style={{
            ...(isMobile ? mobileStyles : {
              width: size.width,
              height: isMinimized ? 64 : size.height,
            }),
            transform: isOpen ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(20px)',
            opacity: isOpen ? 1 : 0,
          }}
        >
          {/* Header */}
          <div className={`bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white flex justify-between items-center relative overflow-hidden ${
            isMobile ? 'p-3 pt-safe' : 'p-4'
          }`}>
            {/* Animated background elements */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
            <div className={`absolute -top-2 -right-2 bg-white/10 rounded-full animate-pulse ${
              isMobile ? 'w-16 h-16' : 'w-20 h-20'
            }`}></div>
            <div className={`absolute -bottom-2 -left-2 bg-white/5 rounded-full animate-pulse ${
              isMobile ? 'w-12 h-12' : 'w-16 h-16'
            }`} style={{ animationDelay: '1s' }}></div>
            
            <div className={`flex items-center relative z-10 ${
              isMobile ? 'space-x-2' : 'space-x-3'
            }`}>
              <div className="relative">
                <div className={`bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm ${
                  isMobile ? 'w-8 h-8' : 'w-10 h-10'
                }`}>
                  <GraduationCap size={isMobile ? 16 : 20} className="text-white animate-bounce" style={{ animationDuration: '2s' }} />
                </div>
                <div className={`absolute -top-1 -right-1 bg-green-500 rounded-full border-2 border-white animate-pulse ${
                  isMobile ? 'w-3 h-3' : 'w-4 h-4'
                }`}></div>
              </div>
              <div>
                <h3 className={`font-bold ${isMobile ? 'text-base' : 'text-lg'}`}>AI Study Buddy</h3>
                <p className={`text-white/80 flex items-center ${isMobile ? 'text-xs' : 'text-xs'}`}>
                  <Sparkles size={isMobile ? 10 : 12} className="mr-1 animate-spin" style={{ animationDuration: '3s' }} />
                  Ready to help you learn!
                </p>
              </div>
            </div>
            
            <div className={`flex items-center relative z-10 ${
              isMobile ? 'space-x-1' : 'space-x-2'
            }`}>
              {!isMobile && (
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
                title={isMinimized ? "Expand" : "Minimize"}
              >
                {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
              </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className={`hover:bg-white/20 rounded-lg transition-colors duration-200 hover:rotate-90 ${
                  isMobile ? 'p-1' : 'p-2'
                }`}
                title="Close"
              >
                <X size={isMobile ? 16 : 18} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          {!isMinimized && (
            <>
              <div className={`flex-1 overflow-y-auto space-y-4 bg-gradient-to-b from-slate-50 to-white ${
                isMobile ? 'p-3 pb-safe' : 'p-4'
              }`}>
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"} animate-fade-in-up`}
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    <div
                      className={`shadow-sm ${
                        isMobile ? 'max-w-[85%] p-2 rounded-xl text-sm' : 'max-w-[80%] p-3 rounded-2xl'
                      } ${
                        m.sender === "user"
                          ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-br-md"
                          : "bg-white border border-gray-200 text-gray-800 rounded-bl-md"
                      } transition-all duration-300 hover:shadow-md`}
                    >
                      <p className={`leading-relaxed ${isMobile ? 'text-xs' : 'text-sm'}`}>{m.text}</p>
                      <p className={`mt-1 ${
                        isMobile ? 'text-xs' : 'text-xs'
                      } ${
                        m.sender === "user" ? "text-white/70" : "text-gray-500"
                      }`}>
                        {formatTime(m.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                
                {loading && (
                  <div className="flex justify-start animate-fade-in-up">
                    <div className={`bg-white border border-gray-200 text-gray-800 rounded-bl-md shadow-sm ${
                      isMobile ? 'p-2 rounded-xl' : 'p-3 rounded-2xl'
                    }`}>
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className={`text-gray-600 ${isMobile ? 'text-xs' : 'text-sm'}`}>AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className={`border-t border-gray-200 bg-white/80 backdrop-blur-sm ${
                isMobile ? 'p-3 pb-safe' : 'p-4'
              }`}>
                <div className={`flex ${isMobile ? 'space-x-2' : 'space-x-3'}`}>
                  <div className="flex-1 relative">
                    <input
                      className={`w-full border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors duration-200 bg-white/90 backdrop-blur-sm ${
                        isMobile ? 'px-3 py-2 text-sm' : 'px-4 py-3 text-sm'
                      }`}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask about science, labs, or anything! 🧪"
                      onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                      disabled={loading}
                    />
                    <BookOpen className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 ${
                      isMobile ? 'right-2' : 'right-3'
                    }`} size={isMobile ? 14 : 16} />
                  </div>
                  <button
                    onClick={sendMessage}
                    disabled={loading || !input.trim()}
                    className={`bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-indigo-500/25 ${
                      isMobile ? 'px-4 py-2 text-sm' : 'px-6 py-3'
                    }`}
                  >
                    <span className={`font-medium ${isMobile ? 'text-sm' : ''}`}>Send</span>
                  </button>
                </div>
                
                {/* Quick Actions */}
                <div className={`flex mt-3 ${
                  isMobile ? 'space-x-1 flex-wrap gap-1' : 'space-x-2'
                }`}>
                  <button
                    onClick={() => setInput("Explain how chemical equations work")}
                    className={`bg-indigo-100 text-indigo-700 rounded-full hover:bg-indigo-200 transition-colors duration-200 ${
                      isMobile ? 'px-2 py-1 text-xs' : 'px-3 py-1 text-xs'
                    }`}
                  >
                    🧪 {isMobile ? 'Chemistry' : 'Chemistry Help'}
                  </button>
                  <button
                    onClick={() => setInput("How do I use the virtual labs?")}
                    className={`bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors duration-200 ${
                      isMobile ? 'px-2 py-1 text-xs' : 'px-3 py-1 text-xs'
                    }`}
                  >
                    🔬 {isMobile ? 'Labs' : 'Lab Guide'}
                  </button>
                  <button
                    onClick={() => setInput("Explain physics concepts")}
                    className={`bg-pink-100 text-pink-700 rounded-full hover:bg-pink-200 transition-colors duration-200 ${
                      isMobile ? 'px-2 py-1 text-xs' : 'px-3 py-1 text-xs'
                    }`}
                  >
                    ⚡ {isMobile ? 'Physics' : 'Physics Help'}
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Resize Handle */}
          {!isMinimized && !isMobile && (
            <div
              className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize hover:bg-indigo-500/20 transition-colors duration-200"
              onMouseDown={handleMouseDown}
              title="Drag to resize"
            >
              <div className="absolute top-1 left-1 w-2 h-2 border-t-2 border-l-2 border-gray-400"></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}