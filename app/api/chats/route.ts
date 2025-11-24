import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongoose";
import Chat from "@/lib/models/Chat";

export async function GET() {
  try {
    await dbConnect();
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const chats = await Chat.find(
      { userId: session.user.id },
      { _id: 1, title: 1, createdAt: 1 }
    )
      .sort({ createdAt: -1 })
      .lean();

    // Transform MongoDB _id to id for API consistency
    const formattedChats = chats.map((chat: any) => ({
      id: chat._id.toString(),
      title: chat.title,
      createdAt: chat.createdAt,
    }));

    return NextResponse.json(formattedChats);
  } catch (error) {
    console.error("Chats API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
