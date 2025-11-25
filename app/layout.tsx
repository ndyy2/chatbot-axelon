import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import "./globals.css";

export const metadata: Metadata = {
  title: "Axelon Chatbot",
  description: "Intelligent AI chatbot powered by OpenAI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased font-sans">
        <SessionProvider>
          <ThemeProvider enableSystem attribute="class">
            {children}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
