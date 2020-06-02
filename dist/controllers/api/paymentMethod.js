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
const PaymentMethod_1 = require("../../models/PaymentMethod");
const getPaymentAccount_1 = require("../../service/getPaymentAccount");
/**
 * GET /api/payment_methods
 */
exports.getPaymentMethods = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield PaymentMethod_1.PaymentMethod.find({});
        return res.status(200).json(result);
    }
    catch (e) {
        return res.status(500).json(e);
    }
});
/**
 * POST /api/payment_methods
 */
exports.postPaymentMethod = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    try {
        const result = yield PaymentMethod_1.PaymentMethod.create({ name });
        return res.status(201).json(result);
    }
    catch (e) {
        res.status(500).json(e);
    }
});
/**
 * PUT /api/payment_methods
 */
exports.editPaymentMethod = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name } = req.body;
    try {
        const result = yield PaymentMethod_1.PaymentMethod.findByIdAndUpdate(id, { name }, { new: true });
        return res.status(201).json(result);
    }
    catch (e) {
        res.status(500).json(e);
    }
});
/**
 * API GET /api/payment_method_avaibilities
 */
exports.getPaymentMethodAvaibilities = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const methods = yield PaymentMethod_1.PaymentMethod.find({});
        const results = [];
        for (const method of methods) {
            const methodAvaibility = yield getPaymentAccount_1.getAvailableAccountsCount(method._id);
            results.push(Object.assign(Object.assign({}, method.toObject()), { available: methodAvaibility > 0 }));
        }
        return res.status(200).json(results);
    }
    catch (e) {
        return res.status(500).json(e);
    }
});
//# sourceMappingURL=paymentMethod.js.map