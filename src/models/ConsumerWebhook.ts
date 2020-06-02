import mongoose, { Schema, Document } from "mongoose";

export type ConsumerWebhookDocument = Document & {
  _id: string;
  url: string;
  userId: string;
};

const consumerWebhookSchema = new Schema(
  {
    url: String,
    userId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const ConsumerWebhook = mongoose.model<ConsumerWebhookDocument>(
  "ConsumerWebhook",
  consumerWebhookSchema
);
