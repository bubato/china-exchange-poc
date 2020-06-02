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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PaymentAccount_1 = require("../../models/PaymentAccount");
const PaymentMethod_1 = require("../../models/PaymentMethod");
const lowerCase_1 = __importDefault(require("lodash/lowerCase"));
const toNumber_1 = __importDefault(require("lodash/toNumber"));
/**
 * GET /api/payment_accounts
 */
exports.getPaymentAccounts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield PaymentAccount_1.PaymentAccount.find({}).populate({
            path: "paymentMethod",
            select: "name _id",
        });
        return res.status(200).json(result);
    }
    catch (e) {
        return res.status(500).json(e);
    }
});
/**
 * POST /api/payment_accounts
 */
exports.postPaymentAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, paymentMethodId, accountNo, accountOwnerName, dailyLimit, } = req.body;
    try {
        const method = yield PaymentMethod_1.PaymentMethod.findById(paymentMethodId);
        if (lowerCase_1.default(method.name) !== lowerCase_1.default("bank") && !req.file) {
            return res.status(400).send("must have qr code");
        }
        const result = yield PaymentAccount_1.PaymentAccount.create({
            name,
            paymentMethod: paymentMethodId,
            accountNo,
            accountOwnerName,
            dailyLimit: toNumber_1.default(dailyLimit),
            dailyRequestedAmount: 0,
            qrCodeUrl: req.file ? `/images/uploads/${req.file.filename}` : null,
        });
        return res.status(201).json(result);
    }
    catch (e) {
        return res.status(500).json(e);
    }
});
//# sourceMappingURL=paymentAccount.js.map