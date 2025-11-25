import React, { useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { MessageBubble } from "./MessageBubble";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  isStreaming?: boolean;
}

interface ChatAreaProps {
  messages: Message[];
  isTyping: boolean;
}

export const ChatArea: React.FC<ChatAreaProps> = ({ messages, isTyping }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-0 scroll-smooth custom-scrollbar pb-32">
      <div className="max-w-3xl mx-auto pt-24 space-y-8">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
        </AnimatePresence>

        {/* Loading / Typing */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-full bg-[#0F172A] border border-blue-500/20 flex items-center justify-center shrink-0">
              <Sparkles size={18} className="text-blue-500 animate-pulse" />
            </div>
            <div className="bg-[#1e293b]/40 border border-white/5 px-4 py-3 rounded-full flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 bg-blue-400 rounded-full"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.4, 1, 0.4] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.2,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} className="h-4" />
      </div>
    </div>
  );
};
