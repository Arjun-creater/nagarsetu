import React, { useState, useRef, useEffect } from "react";
import { Bot, Send, X, MessageSquare, CircleAlert } from "lucide-react";

/* STREAMING_CHUNK:Mocking the external service... */
// Mocking the external service to make this file completely runnable
const sendChatMessage = async (msg) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        reply: `Thank you for your query regarding "${msg}". As your NagarSetu Assistant, I'm analyzing the civic database for the best resolution.`,
      });
    }, 1500);
  });
};

/* STREAMING_CHUNK:Defining reusable sub-components... */
const TypingIndicator = () => (
  <div className="flex items-center space-x-1.5 p-3 bg-white border border-slate-200 rounded-2xl rounded-tl-sm w-fit shadow-sm">
    <div
      className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
      style={{ animationDelay: "0ms" }}
    />
    <div
      className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
      style={{ animationDelay: "150ms" }}
    />
    <div
      className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
      style={{ animationDelay: "300ms" }}
    />
  </div>
);

/* STREAMING_CHUNK:Initializing the main ChatWidget component... */
export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! I'm the NagarSetu Assistant. How can I help you with civic queries today?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const faqSuggestions = [
  
  "Which department handles garbage?",
  
   "Water leakage issue",
 ];

  /* STREAMING_CHUNK:Handling side effects and auto-scrolling... */
  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  /* STREAMING_CHUNK:Implementing message send logic... */
  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage = { sender: "user", text: message.trim() };
    setMessages((prev) => [...prev, userMessage]);
    const currentMessage = message.trim();
    setMessage("");
    setError(null);

    try {
      setIsLoading(true);
      const response = await sendChatMessage(currentMessage);
      setMessages((prev) => [...prev, { sender: "bot", text: response.reply }]);
    } catch (err) {
      setError("I'm temporarily unavailable. Please try again shortly.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  const handleFaqClick = async (
  question
) => {

  if (isLoading) return;

  const userMessage = {
    sender: "user",
    text: question,
  };

  setMessages((prev) => [
    ...prev,
    userMessage,
  ]);

  try {

    setIsLoading(true);

    const response =
      await sendChatMessage(
        question
      );

    setMessages((prev) => [
      ...prev,
      {
        sender: "bot",
        text: response.reply,
      },
    ]);

  } catch (err) {

    setError(
      "I'm temporarily unavailable. Please try again shortly."
    );

  } finally {

    setIsLoading(false);
  }
};

  /* STREAMING_CHUNK:Rendering the UI... */
  return (
    <>
      {/* Injecting keyframes for smooth entrance animations */}
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .chat-window-enter {
          animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        /* Hide scrollbar for cleaner look but keep functionality */
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`fixed bottom-6 right-6 z-[9999] flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-slate-800 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-slate-900/20 active:scale-95 ${
          isOpen ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
        }`}
        aria-label="Open chat widget"
      >
        <MessageSquare className="h-6 w-6" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className="chat-window-enter fixed bottom-0 right-0 z-[9999] flex h-[100dvh] w-full flex-col overflow-hidden bg-white shadow-2xl sm:bottom-24 sm:right-6 sm:h-[600px] sm:max-h-[calc(100vh-120px)] sm:w-[380px] sm:rounded-2xl sm:border sm:border-slate-200"
          role="dialog"
          aria-label="NagarSetu Assistant"
        >
          {/* Header */}
          <div className="flex flex-shrink-0 items-center justify-between bg-slate-900 px-5 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white/10">
                <Bot className="h-5 w-5 text-white" />
                <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-slate-900 bg-emerald-400"></div>
              </div>
              <div className="flex flex-col">
                <h3 className="text-sm font-semibold leading-none tracking-tight text-white">
                  NagarSetu Assistant
                </h3>
                <span className="mt-1 text-xs font-medium text-slate-400">
                  Civic queries · 24/7
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white focus:outline-none"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="no-scrollbar flex flex-1 flex-col gap-4 overflow-y-auto bg-slate-50 p-5">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex w-full ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender === "bot" && (
                  <div className="mr-2 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white">
                    <Bot className="h-4 w-4 text-slate-600" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed shadow-sm ${
                    msg.sender === "user"
                      ? "rounded-tr-sm bg-slate-900 text-white"
                      : "rounded-tl-sm border border-slate-200 bg-white text-slate-800"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex w-full justify-start">
                <div className="mr-2 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white">
                  <Bot className="h-4 w-4 text-slate-600" />
                </div>
                <TypingIndicator />
              </div>
            )}

            {error && (
              <div className="flex items-center justify-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                <CircleAlert className="h-4 w-4" />
                <p>{error}</p>
              </div>
            )}
            <div ref={messagesEndRef} className="h-px w-full" />
          </div>

          {/* Input Area */}
          <div className="flex-shrink-0 bg-white p-4 pt-3 border-t border-slate-100">
            {/* FAQ Suggestions */}

            <div className="relative flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a civic question..."
                disabled={isLoading}
                rows={1}
                className="max-h-[120px] min-h-[44px] w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-500 outline-none transition-all focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100 disabled:opacity-50"
              />
              <button
                onClick={handleSendMessage}
                disabled={!message.trim() || isLoading}
                className="flex h-[44px] w-[44px] flex-shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white transition-all hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                aria-label="Send message"
              >
                <Send className="h-4 w-4 ml-0.5" />
              </button>
            </div>
            {/* Footer text */}
            <div className="mt-3 text-center">
              <p className="text-[11px] font-medium text-slate-400">
                Powered by NagarSetu · Municipal Services
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
