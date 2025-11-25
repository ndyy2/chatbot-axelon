import React from "react";
import { motion } from "framer-motion";
import { Sparkles, User } from "lucide-react";
import { TypewriterText } from "./TypewriterText";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  isStreaming?: boolean;
}

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
      className={cn(
        "flex w-full",
        message.role === "user" ? "justify-end pl-12" : "justify-start pr-12"
      )}
    >
      <div
        className={cn(
          "flex gap-4 max-w-full",
          message.role === "user" ? "flex-row-reverse" : "flex-row"
        )}
      >
        {/* Avatar */}
        <div
          className={cn(
            "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shrink-0 border shadow-md",
            message.role === "ai"
              ? "bg-[#0F172A] border-blue-500/20 shadow-blue-900/10"
              : "bg-[#1e293b] border-white/5"
          )}
        >
          {message.role === "ai" ? (
            <Sparkles size={18} className="text-blue-500" />
          ) : (
            <User size={18} className="text-slate-400" />
          )}
        </div>

        {/* Bubble */}
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              {message.role === "ai" ? "Axelon AI" : "You"}
            </span>
          </div>
          <div
            className={cn(
              "relative px-6 py-4 text-[15px] leading-relaxed shadow-sm",
              message.role === "user"
                ? "bg-[#2563EB] text-white rounded-2xl rounded-tr-sm shadow-[0_4px_15px_rgba(37,99,235,0.2)]"
                : "bg-[#1e293b]/60 backdrop-blur-md border border-white/5 text-slate-200 rounded-2xl rounded-tl-sm"
            )}
          >
            {message.role === "ai" && message.isStreaming ? (
              <TypewriterText text={message.content} />
            ) : (
              message.content
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
