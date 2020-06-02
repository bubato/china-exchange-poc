import { Transaction } from "../models/Transaction";
import { PaymentMethod } from "../models/PaymentMethod";
import { getPaymentAccount } from "./getPaymentAccount";
import { sendWebhookToUser } from "./webhook";

export type TransactionPayload = {
  amount: number;
  paymentType: string;
  userId: string;
  customerId: string;
};

export type SubmitTransactionPayload = {
  id: string;
  senderAccountInfo: string;
};

export async function createTransaction(payload: TransactionPayload) {
  try {
    const paymentAccount = await getPaymentAccount(
      payload.paymentType,
      payload.amount
    );
    if (!paymentAccount) {
      return null;
    }

    const paymentMethod = await PaymentMethod.findOne({
      name: payload.paymentType,
    });

    if (!paymentMethod) {
      return null;
    }

    const transaction = await Transaction.create({
      amount: payload.amount,
      paymentMethod: paymentMethod._id,
      merchandiser: payload.userId,
      customerId: payload.customerId,
      receiverAccount: paymentAccount._id,
      status: "initial",
    });

    if (!paymentAccount.dailyRequestedAmount) {
      paymentAccount.dailyRequestedAmount = payload.amount;
    } else {
      paymentAccount.dailyRequestedAmount += payload.amount;
    }

    await paymentAccount.save();

    return { paymentAccount, transaction };
  } catch (e) {
    return null;
  }
}

export async function submitTransaction(payload: SubmitTransactionPayload) {
  try {
    const transaction = await Transaction.findById(payload.id).populate({
      path: "paymentMethod",
      select: "name _id",
    });

    if (transaction.status !== "initial") {
      return null;
    }

    transaction.senderAccountInfo = payload.senderAccountInfo;
    transaction.status = "submitted";

    await transaction.save();

    return transaction;
  } catch (e) {
    return null;
  }
}

export async function approveTransaction(id: string) {
  try {
    const transaction = await Transaction.findById(id).populate({
      path: "paymentMethod",
      select: "name _id",
    });

    if (transaction.status !== "submitted") {
      return null;
    }
    transaction.status = "approved";

    await transaction.save();

    const { merchandiser } = transaction;

    sendWebhookToUser(merchandiser as string, transaction);

    return transaction;
  } catch (e) {
    return null;
  }
}

export async function rejectTransaction(id: string, reason: string) {
  try {
    const transaction = await Transaction.findById(id).populate({
      path: "paymentMethod",
      select: "name _id",
    });

    if (transaction.status !== "submitted") {
      return null;
    }

    transaction.status = "rejected";
    transaction.rejectReason = reason;

    await transaction.save();

    return transaction;
  } catch (e) {
    return null;
  }
}
