import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, Paperclip } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface InputBarProps {
  onSendMessage: (message: string) => void;
  isTyping: boolean;
}

export const InputBar: React.FC<InputBarProps> = ({
  onSendMessage,
  isTyping,
}) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isTyping) return;
    onSendMessage(input.trim());
    setInput("");
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 md:pb-8 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/80 to-transparent z-20">
      <div className="max-w-3xl mx-auto">
        <motion.form
          layout
          onSubmit={handleSubmit}
          className={cn(
            "relative group bg-[#1e293b]/80 backdrop-blur-2xl border transition-all duration-300 rounded-full p-2 pl-3 flex items-center gap-2 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]",
            isTyping
              ? "border-white/5 opacity-80"
              : "border-white/10 hover:border-blue-500/30 focus-within:border-blue-500/50 focus-within:shadow-[0_0_30px_rgba(37,99,235,0.15)]"
          )}
        >
          {/* Attachment Button */}
          <button
            type="button"
            className="p-3 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Paperclip size={20} />
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Axelon anything..."
            className="flex-1 bg-transparent text-slate-200 placeholder-slate-500 text-[15px] focus:outline-none px-2 h-10"
            disabled={isTyping}
          />

          {/* Send Button (Dynamic) */}
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
              input.trim() && !isTyping
                ? "bg-[#2563EB] text-white shadow-[0_0_15px_rgba(37,99,235,0.5)] hover:bg-[#1D4ED8] hover:scale-105"
                : "bg-slate-800 text-slate-600"
            )}
          >
            <Send
              size={18}
              className={cn(input.trim() && !isTyping && "ml-0.5")}
            />
          </button>
        </motion.form>

        <p className="text-center text-[10px] text-slate-600 mt-4 font-medium tracking-widest opacity-60">
          AXELON INTELLIGENCE SYSTEM v2.0
        </p>
      </div>
    </div>
  );
};
