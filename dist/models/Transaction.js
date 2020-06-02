"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const transactionSchema = new mongoose_1.default.Schema({
    paymentMethod: { type: mongoose_1.Schema.Types.ObjectId, ref: "PaymentMethod" },
    receiverAccount: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "PaymentAccount",
    },
    senderAccountInfo: String,
    amount: Number,
    rejectReason: String,
    merchandiser: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    customerId: String,
    status: String,
}, { timestamps: true });
transactionSchema.plugin(mongoose_paginate_v2_1.default);
exports.Transaction = mongoose_1.default.model("Transaction", transactionSchema);
//# sourceMappingURL=Transaction.js.map