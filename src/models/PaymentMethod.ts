import mongoose, { Schema } from "mongoose";

export type PaymentMethodDocument = mongoose.Document & {
  _id: string;
  name: string;
};

const paymentMethodSchema = new Schema(
  {
    name: { type: String, unique: true },
  },
  { timestamps: true }
);

export const PaymentMethod = mongoose.model<PaymentMethodDocument>(
  "PaymentMethod",
  paymentMethodSchema
);
