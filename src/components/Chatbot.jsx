import React, { useState, useRef, useEffect } from "react";
import {
    ChatBubbleLeftRightIcon,
    PaperAirplaneIcon,
    XMarkIcon,
    SparklesIcon
} from "@heroicons/react/24/solid";
import { sendMessageToGemini } from "../services/gemini";

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, role: "model", text: "Hi! I'm your personal health assistant. How can I help you with your diet or workout today?" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { id: Date.now(), role: "user", text: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            // Prepare history for context (excluding the very last user message we just added locally for display, 
            // but the service handles appending the new one. We just pass the previous history)
            const history = messages.map(m => ({ role: m.role, text: m.text }));

            const replyText = await sendMessageToGemini(userMessage.text, history);

            const botMessage = { id: Date.now() + 1, role: "model", text: replyText };
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            const errorMessage = { id: Date.now() + 1, role: "model", text: "Sorry, something went wrong. Please try again." };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="mb-4 w-[350px] md:w-[400px] h-[500px] bg-neutral-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fadeIn">
                    {/* Header */}
                    <div className="p-4 bg-gradient-to-r from-teal-900/50 to-blue-900/50 border-b border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-gradient-to-br from-teal-400 to-blue-500">
                                <SparklesIcon className="h-4 w-4 text-black" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-white text-sm">AI Assistant</h3>
                                <p className="text-[10px] text-teal-200">Powered by Gemini</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                        >
                            <XMarkIcon className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${msg.role === "user"
                                            ? "bg-gradient-to-br from-teal-500 to-blue-600 text-white rounded-tr-none"
                                            : "bg-white/10 text-gray-200 rounded-tl-none border border-white/5"
                                        }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white/10 p-3 rounded-2xl rounded-tl-none border border-white/5 flex gap-1 items-center">
                                    <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                    <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                    <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} className="p-3 bg-black/20 border-t border-white/10">
                        <div className="relative flex items-center">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about calories, nutrition..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-4 pr-10 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                className="absolute right-2 p-1.5 rounded-lg bg-teal-500/20 text-teal-400 hover:bg-teal-500 hover:text-black disabled:opacity-50 disabled:hover:bg-teal-500/20 disabled:hover:text-teal-400 transition-all"
                            >
                                <PaperAirplaneIcon className="h-4 w-4" />
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-4 rounded-full shadow-lg shadow-teal-500/20 transition-all duration-300 hover:scale-110 ${isOpen
                        ? "bg-neutral-800 text-gray-400 rotate-90"
                        : "bg-gradient-to-br from-teal-400 to-blue-600 text-black"
                    }`}
            >
                {isOpen ? (
                    <XMarkIcon className="h-6 w-6" />
                ) : (
                    <ChatBubbleLeftRightIcon className="h-6 w-6" />
                )}
            </button>
        </div>
    );
};

export default Chatbot;
