import mongoose, { Schema } from "mongoose";
import { PaymentMethodDocument } from "./PaymentMethod";

export type PaymentAccountDocument = mongoose.Document & {
  _id: string;
  paymentMethod: PaymentMethodDocument | string;
  owner: string;
  name: string;
  accountNo: string;
  accountOwnerName: string;
  dailyLimit: number;
  dailyRequestedAmount: number;
  qrCodeUrl: string;
};

const paymentAccountSchema = new mongoose.Schema(
  {
    name: String,
    paymentMethod: { type: Schema.Types.ObjectId, ref: "PaymentMethod" },
    owner: String,
    accountNo: String,
    accountOwnerName: String,
    dailyLimit: Number,
    dailyRequestedAmount: Number,
    qrCodeUrl: String,
  },
  { timestamps: true }
);

export const PaymentAccount = mongoose.model<PaymentAccountDocument>(
  "PaymentAccount",
  paymentAccountSchema
);
