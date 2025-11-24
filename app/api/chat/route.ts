import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import OpenAI from "openai";
import dbConnect from "@/lib/mongoose";
import Chat from "@/lib/models/Chat";
import Message from "@/lib/models/Message";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const session = await auth();
    const { message, chatId } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    let currentChatId = chatId;

    // If no chatId, create a new chat for logged-in users
    if (!currentChatId && session?.user?.id) {
      const newChat = await Chat.create({
        userId: session.user.id,
        title: message.slice(0, 50), // First 50 chars as title
      });
      currentChatId = newChat._id.toString();
    }

    // Save user message if chat exists
    if (currentChatId && session?.user?.id) {
      await Message.create({
        chatId: currentChatId,
        role: "user",
        content: message,
      });
    }

    // Get response from OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful and engaging chatbot. Provide clear, concise, and friendly responses.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const response =
      completion.choices[0]?.message?.content ||
      "Sorry, I couldn't generate a response.";

    // Save assistant message if chat exists
    if (currentChatId && session?.user?.id) {
      await Message.create({
        chatId: currentChatId,
        role: "assistant",
        content: response,
      });
    }

    return NextResponse.json({ response, chatId: currentChatId });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
