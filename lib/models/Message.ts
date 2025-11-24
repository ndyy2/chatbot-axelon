import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  chatId: { type: String, required: true },
  role: { type: String, required: true, enum: ["user", "assistant"] },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Message ||
  mongoose.model("Message", MessageSchema);
