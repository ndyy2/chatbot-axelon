import mongoose, { Schema } from "mongoose";

export interface IMessage {
  _id?: string;
  conversationId: string;
  role: "user" | "assistant";
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const MessageSchema: Schema = new Schema(
  {
    conversationId: { type: String, required: true },
    role: { type: String, enum: ["user", "assistant"], required: true },
    content: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Message ||
  mongoose.model<IMessage>("Message", MessageSchema);
