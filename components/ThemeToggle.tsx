"use client";

import { useTheme } from "next-themes";
import { useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted] = useState(true);

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-md hover:bg-accent"
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
