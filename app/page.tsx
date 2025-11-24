"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import ChatInterface from "../components/ChatInterface";
import Sidebar from "../components/Sidebar";
import ThemeToggle from "../components/ThemeToggle";

export default function Home() {
  const { data: session } = useSession();
  const { theme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar for logged-in users */}
      {session && (
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            {session && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 rounded-md hover:bg-accent"
              >
                ☰
              </button>
            )}
            <h1 className="text-xl font-semibold">Chatbot Axelon</h1>
          </div>
          <ThemeToggle />
        </header>

        {/* Chat Interface */}
        <ChatInterface />
      </div>
    </div>
  );
}
