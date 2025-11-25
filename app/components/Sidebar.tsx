import React from "react";
import { motion } from "framer-motion";
import {
  Plus,
  MessageSquare,
  PanelLeftClose,
  Command,
  User,
  Settings,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  conversations: Array<{ id: string; title: string }>;
  onNewConversation: () => void;
  onSelectConversation: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onToggle,
  conversations,
  onNewConversation,
  onSelectConversation,
}) => {
  return (
    <motion.aside
      initial={{ width: 280, opacity: 1 }}
      animate={{
        width: isOpen ? 280 : 0,
        opacity: isOpen ? 1 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 25,
      }}
      className="border-r border-white/5 bg-[#0F172A]/80 backdrop-blur-2xl hidden md:flex flex-col relative z-30 overflow-hidden shadow-[5px_0_30px_rgba(0,0,0,0.3)]"
    >
      <div className="w-[280px] flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-[#1D4ED8] flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)] border border-white/10">
              <Command size={20} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-white text-lg tracking-tight leading-none">
                Axelon
              </h1>
              <p className="text-[10px] text-blue-400 font-medium tracking-widest mt-1">
                INTELLIGENCE
              </p>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="text-slate-500 hover:text-white transition-colors p-1"
          >
            <PanelLeftClose size={18} />
          </button>
        </div>

        {/* Sidebar Actions */}
        <div className="px-5 pb-6">
          <button
            onClick={onNewConversation}
            className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-blue-600/20 border border-white/5 hover:border-blue-500/50 text-slate-200 hover:text-blue-100 py-3.5 rounded-xl transition-all duration-300 group"
          >
            <Plus
              size={18}
              className="text-blue-500 group-hover:text-blue-300"
            />
            <span className="text-sm font-medium">New Session</span>
          </button>
        </div>

        {/* Sidebar List */}
        <div className="flex-1 overflow-y-auto px-3 custom-scrollbar">
          <div className="px-4 pb-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
            Recent
          </div>
          <div className="space-y-1">
            {conversations.map((item, i) => (
              <button
                key={i}
                onClick={() => onSelectConversation(item.id)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-lg text-left transition-all group"
              >
                <MessageSquare
                  size={16}
                  className="text-slate-600 group-hover:text-blue-400 transition-colors"
                />
                <span className="text-sm text-slate-400 group-hover:text-slate-200 truncate">
                  {item.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-5 border-t border-white/5">
          <button className="flex items-center gap-3 w-full hover:bg-white/5 p-2 rounded-lg transition-colors">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 border border-white/10 flex items-center justify-center">
              <User size={14} className="text-slate-300" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-white">Guest User</p>
              <p className="text-xs text-slate-500">Free Plan</p>
            </div>
            <Settings size={16} className="text-slate-500" />
          </button>
        </div>
      </div>
    </motion.aside>
  );
};
