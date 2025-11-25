"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { Sidebar } from "./components/Sidebar";
import { ChatArea } from "./components/ChatArea";
import { InputBar } from "./components/InputBar";

// --- Types ---
interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  isStreaming?: boolean;
}

interface Conversation {
  id: string;
  title: string;
}

// --- Main Component ---
export default function AxelonChatPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "ai",
      content:
        "Selamat datang di Axelon. Sistem siap. Apa fokus utama agenda Anda hari ini?",
      isStreaming: false,
    },
  ]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<
    string | null
  >(null);
  const [isTyping, setIsTyping] = useState(false);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const response = await fetch("/api/conversations");
      if (response.ok) {
        const data = await response.json();
        setConversations(
          data.conversations.map((conv: any) => ({
            id: conv._id,
            title: conv.title,
          }))
        );
      }
    } catch (error) {
      console.error("Failed to load conversations:", error);
    }
  };

  const loadConversationMessages = async (conversationId: string) => {
    try {
      const response = await fetch(
        `/api/chat?conversationId=${conversationId}`
      );
      if (response.ok) {
        const data = await response.json();
        const loadedMessages = data.messages.map((msg: any) => ({
          id: msg._id,
          role: msg.role,
          content: msg.content,
          isStreaming: false,
        }));
        setMessages(loadedMessages);
        setCurrentConversationId(conversationId);
      }
    } catch (error) {
      console.error("Failed to load messages:", error);
    }
  };

  const handleSendMessage = async (message: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: message,
      isStreaming: false,
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          conversationId: currentConversationId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const aiMessage: Message = {
          id: data.botMessage._id,
          role: "ai",
          content: data.botMessage.content,
          isStreaming: true,
        };
        setMessages((prev) => [...prev, aiMessage]);

        // Update conversations list if new conversation was created
        if (!currentConversationId) {
          setCurrentConversationId(data.conversationId);
          loadConversations();
        }
      } else {
        console.error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleNewConversation = () => {
    setMessages([
      {
        id: "1",
        role: "ai",
        content:
          "Selamat datang di Axelon. Sistem siap. Apa fokus utama agenda Anda hari ini?",
        isStreaming: false,
      },
    ]);
    setCurrentConversationId(null);
  };

  const handleSelectConversation = (conversationId: string) => {
    loadConversationMessages(conversationId);
  };

  return (
    <div className="flex h-screen bg-[#0F172A] text-slate-200 overflow-hidden font-sans selection:bg-blue-500/30 relative">
      {/* Ambient Background Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#1D4ED8]/10 rounded-full blur-[120px] opacity-60" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#2563EB]/10 rounded-full blur-[120px] opacity-50" />
      </div>

      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        conversations={conversations}
        onNewConversation={handleNewConversation}
        onSelectConversation={handleSelectConversation}
      />

      <main className="flex-1 flex flex-col relative min-w-0 z-10">
        {/* Mobile Header */}
        <header className="h-20 flex items-center px-6 justify-between absolute top-0 left-0 right-0 z-40 pointer-events-none">
          <div className="pointer-events-auto">
            {!isSidebarOpen && (
              <motion.button
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                onClick={() => setIsSidebarOpen(true)}
                className="p-3 bg-[#0F172A]/80 backdrop-blur-md border border-white/10 rounded-xl text-slate-400 hover:text-white hover:border-blue-500/30 transition-all shadow-lg"
              >
                <Menu size={20} />
              </motion.button>
            )}
          </div>
          <div className="md:hidden pointer-events-auto flex items-center gap-2">
            <span className="font-bold text-white tracking-wide">Axelon</span>
          </div>
        </header>

        <ChatArea messages={messages} isTyping={isTyping} />

        <InputBar onSendMessage={handleSendMessage} isTyping={isTyping} />
      </main>
    </div>
  );
}
