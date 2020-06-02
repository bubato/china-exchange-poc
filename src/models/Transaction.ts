import mongoose, { Schema } from "mongoose";
import { PaymentMethodDocument } from "./PaymentMethod";
import { PaymentAccountDocument } from "./PaymentAccount";
import { UserDocument } from "./User";
import mongoosePaginate from "mongoose-paginate-v2";

export type TransactionDocument = mongoose.Document & {
  _id: string;
  paymentMethod: PaymentMethodDocument | string;
  receiverAccount: PaymentAccountDocument | string;
  senderAccountInfo: string;
  amount: number;
  merchandiser: UserDocument | string;
  customerId: string;
  rejectReason?: string;
  status: "initial" | "submitted" | "rejected" | "approved";
};

export type TransactionDto = TransactionDocument & {
  commision: number;
  deposit: number;
};

const transactionSchema = new mongoose.Schema(
  {
    paymentMethod: { type: Schema.Types.ObjectId, ref: "PaymentMethod" },
    receiverAccount: {
      type: Schema.Types.ObjectId,
      ref: "PaymentAccount",
    },
    senderAccountInfo: String,
    amount: Number,
    rejectReason: String,
    merchandiser: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    customerId: String,
    status: String,
  },
  { timestamps: true }
);

transactionSchema.plugin(mongoosePaginate);

export const Transaction = mongoose.model<TransactionDocument>(
  "Transaction",
  transactionSchema
) as mongoose.PaginateModel<TransactionDocument>;
