import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongoose";
import Conversation from "@/lib/models/Conversation";
import Message from "@/lib/models/Message";
import { randomUUID } from "crypto";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const session = await auth();
    const { message, conversationId } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    let conversation;
    let sessionId: string | undefined;

    if (session?.user?.id) {
      // Logged in user
      if (conversationId) {
        conversation = await Conversation.findOne({
          _id: conversationId,
          userId: session.user.id,
        });
      }

      if (!conversation) {
        conversation = new Conversation({
          userId: session.user.id,
          title: message.slice(0, 50) + (message.length > 50 ? "..." : ""),
        });
        await conversation.save();
      }
    } else {
      // Guest user
      const cookies = request.cookies;
      sessionId = cookies.get("chat-session")?.value;

      if (!sessionId) {
        sessionId = randomUUID();
      }

      if (conversationId) {
        conversation = await Conversation.findOne({
          _id: conversationId,
          sessionId,
        });
      }

      if (!conversation) {
        conversation = new Conversation({
          sessionId,
          title: message.slice(0, 50) + (message.length > 50 ? "..." : ""),
        });
        await conversation.save();
      }
    }

    // Save user message
    const userMessage = new Message({
      conversationId: conversation._id,
      role: "user",
      content: message,
    });
    await userMessage.save();

    // Get conversation history for context
    const messages = await Message.find({
      conversationId: conversation._id,
    }).sort({ createdAt: 1 });
    const conversationHistory = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Generate bot response using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are Axelon, an intelligent AI assistant. Provide helpful, accurate, and engaging responses.",
        },
        ...conversationHistory,
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const botResponse =
      completion.choices[0].message.content ||
      "Sorry, I couldn't generate a response.";

    const botMessage = new Message({
      conversationId: conversation._id,
      role: "assistant",
      content: botResponse,
    });
    await botMessage.save();

    const response = NextResponse.json({
      conversationId: conversation._id,
      userMessage: userMessage,
      botMessage: botMessage,
    });

    // Set session cookie for guests
    if (!session?.user?.id && sessionId) {
      response.cookies.set("chat-session", sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }

    return response;
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const session = await auth();
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get("conversationId");

    if (!conversationId) {
      return NextResponse.json(
        { error: "Conversation ID is required" },
        { status: 400 }
      );
    }

    let conversation;

    if (session?.user?.id) {
      conversation = await Conversation.findOne({
        _id: conversationId,
        userId: session.user.id,
      });
    } else {
      const cookies = request.cookies;
      const sessionId = cookies.get("chat-session")?.value;
      if (sessionId) {
        conversation = await Conversation.findOne({
          _id: conversationId,
          sessionId,
        });
      }
    }

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    const messages = await Message.find({ conversationId }).sort({
      createdAt: 1,
    });

    return NextResponse.json({
      conversation,
      messages,
    });
  } catch (error) {
    console.error("Chat history API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
