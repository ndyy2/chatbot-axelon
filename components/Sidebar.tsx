"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface Chat {
  id: string;
  title: string;
  createdAt: string;
}

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const { data: session } = useSession();
  const [chats, setChats] = useState<Chat[]>([]);

  const fetchChats = async () => {
    try {
      const res = await fetch("/api/chats");
      if (res.ok) {
        const data = await res.json();
        setChats(data);
      }
    } catch (error) {
      console.error("Failed to fetch chats:", error);
    }
  };

  const exportChat = async (chatId: string) => {
    try {
      const res = await fetch(`/api/chats/${chatId}/export`);
      if (res.ok) {
        const data = await res.json();
        const blob = new Blob([JSON.stringify(data, null, 2)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `chat-${chatId}.json`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Failed to export chat:", error);
    }
  };

  const clearChat = async (chatId: string) => {
    if (!confirm("Are you sure you want to delete this chat?")) return;

    try {
      const res = await fetch(`/api/chats/${chatId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setChats((prev) => prev.filter((chat) => chat.id !== chatId));
      }
    } catch (error) {
      console.error("Failed to clear chat:", error);
    }
  };

  useEffect(() => {
    if (session) {
      // Fetch chats from API
      fetchChats();
    }
  }, [session]);

  if (!session) return null;

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-200 ease-in-out`}
      >
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Chat History</h2>
          <div className="space-y-2">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className="p-2 rounded-md hover:bg-accent cursor-pointer group"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-sm truncate">
                      {chat.title || "New Chat"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(chat.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 flex space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        exportChat(chat.id);
                      }}
                      className="text-xs p-1 hover:bg-muted rounded"
                      title="Export chat"
                    >
                      📄
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        clearChat(chat.id);
                      }}
                      className="text-xs p-1 hover:bg-muted rounded text-red-500"
                      title="Clear chat"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
