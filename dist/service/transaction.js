"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Transaction_1 = require("../models/Transaction");
const PaymentMethod_1 = require("../models/PaymentMethod");
const getPaymentAccount_1 = require("./getPaymentAccount");
const webhook_1 = require("./webhook");
function createTransaction(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const paymentAccount = yield getPaymentAccount_1.getPaymentAccount(payload.paymentType, payload.amount);
            if (!paymentAccount) {
                return null;
            }
            const paymentMethod = yield PaymentMethod_1.PaymentMethod.findOne({
                name: payload.paymentType,
            });
            if (!paymentMethod) {
                return null;
            }
            const transaction = yield Transaction_1.Transaction.create({
                amount: payload.amount,
                paymentMethod: paymentMethod._id,
                merchandiser: payload.userId,
                customerId: payload.customerId,
                receiverAccount: paymentAccount._id,
                status: "initial",
            });
            if (!paymentAccount.dailyRequestedAmount) {
                paymentAccount.dailyRequestedAmount = payload.amount;
            }
            else {
                paymentAccount.dailyRequestedAmount += payload.amount;
            }
            yield paymentAccount.save();
            return { paymentAccount, transaction };
        }
        catch (e) {
            return null;
        }
    });
}
exports.createTransaction = createTransaction;
function submitTransaction(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const transaction = yield Transaction_1.Transaction.findById(payload.id).populate({
                path: "paymentMethod",
                select: "name _id",
            });
            if (transaction.status !== "initial") {
                return null;
            }
            transaction.senderAccountInfo = payload.senderAccountInfo;
            transaction.status = "submitted";
            yield transaction.save();
            return transaction;
        }
        catch (e) {
            return null;
        }
    });
}
exports.submitTransaction = submitTransaction;
function approveTransaction(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const transaction = yield Transaction_1.Transaction.findById(id).populate({
                path: "paymentMethod",
                select: "name _id",
            });
            if (transaction.status !== "submitted") {
                return null;
            }
            transaction.status = "approved";
            yield transaction.save();
            const { merchandiser } = transaction;
            webhook_1.sendWebhookToUser(merchandiser, transaction);
            return transaction;
        }
        catch (e) {
            return null;
        }
    });
}
exports.approveTransaction = approveTransaction;
function rejectTransaction(id, reason) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const transaction = yield Transaction_1.Transaction.findById(id).populate({
                path: "paymentMethod",
                select: "name _id",
            });
            if (transaction.status !== "submitted") {
                return null;
            }
            transaction.status = "rejected";
            transaction.rejectReason = reason;
            yield transaction.save();
            return transaction;
        }
        catch (e) {
            return null;
        }
    });
}
exports.rejectTransaction = rejectTransaction;
//# sourceMappingURL=transaction.js.map