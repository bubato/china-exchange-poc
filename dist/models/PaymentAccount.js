"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const paymentAccountSchema = new mongoose_1.default.Schema({
    name: String,
    paymentMethod: { type: mongoose_1.Schema.Types.ObjectId, ref: "PaymentMethod" },
    owner: String,
    accountNo: String,
    accountOwnerName: String,
    dailyLimit: Number,
    dailyRequestedAmount: Number,
    qrCodeUrl: String,
}, { timestamps: true });
exports.PaymentAccount = mongoose_1.default.model("PaymentAccount", paymentAccountSchema);
//# sourceMappingURL=PaymentAccount.js.map