import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongoose";
import Chat from "@/lib/models/Chat";
import Message from "@/lib/models/Message";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if chat belongs to user
    const chat = await Chat.findOne({
      _id: params.id,
      userId: session.user.id,
    });

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    // Delete messages first
    await Message.deleteMany({ chatId: params.id });

    // Delete chat
    await Chat.deleteOne({ _id: params.id });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete chat error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
