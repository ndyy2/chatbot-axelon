import mongoose, { Schema } from "mongoose";

export interface IConversation {
  _id?: string;
  userId?: string; // Optional for logged-in users
  sessionId?: string; // For guest users
  title: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const ConversationSchema: Schema = new Schema(
  {
    userId: { type: String, required: false },
    sessionId: { type: String, required: false },
    title: { type: String, required: true, default: "New Conversation" },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Conversation ||
  mongoose.model<IConversation>("Conversation", ConversationSchema);
