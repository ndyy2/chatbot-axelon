import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongoose";
import Chat from "@/lib/models/Chat";
import Message from "@/lib/models/Message";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const chat = await Chat.findOne({
      _id: params.id,
      userId: session.user.id,
    });

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    const messages = await Message.find({ chatId: params.id }).sort({
      createdAt: 1,
    });

    const exportData = {
      chatId: chat._id.toString(),
      title: chat.title,
      createdAt: chat.createdAt,
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.createdAt,
      })),
    };

    return NextResponse.json(exportData);
  } catch (error) {
    console.error("Export chat error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
