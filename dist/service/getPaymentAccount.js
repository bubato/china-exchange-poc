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
const PaymentAccount_1 = require("../models/PaymentAccount");
const counter_1 = require("./counter");
const head_1 = __importDefault(require("lodash/head"));
const PaymentMethod_1 = require("../models/PaymentMethod");
const logger_1 = __importDefault(require("../util/logger"));
function getAvailableAccountsCount(paymentMethodId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const count = yield PaymentAccount_1.PaymentAccount.find({
                paymentMethod: paymentMethodId,
                $expr: {
                    $lt: ["$dailyRequestedAmount", "$dailyLimit"],
                },
            }).count();
            return count;
        }
        catch (_a) {
            return 0;
        }
    });
}
exports.getAvailableAccountsCount = getAvailableAccountsCount;
function getPaymentAccount(paymentMethod, amount) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const method = yield PaymentMethod_1.PaymentMethod.findOne({ name: paymentMethod });
            logger_1.default.debug(`selecte payment method is ${JSON.stringify(method)}`);
            const count = yield PaymentAccount_1.PaymentAccount.find({
                paymentMethod: method._id,
                $expr: {
                    $lt: [{ $add: ["$dailyRequestedAmount", amount] }, "$dailyLimit"],
                },
            }).count();
            logger_1.default.debug(`available accounts is ${count}`);
            if (count === 0) {
                return null;
            }
            counter_1.increaseCounter(count);
            const result = yield PaymentAccount_1.PaymentAccount.find({
                paymentMethod: method._id,
                $expr: {
                    $lt: [{ $add: ["$dailyRequestedAmount", amount] }, "$dailyLimit"],
                },
            })
                .skip(counter_1.getCounter())
                .limit(1)
                .populate("paymentMethod");
            if (result.length) {
                logger_1.default.debug(`picked account is  is ${JSON.stringify(head_1.default(result))}`);
                return head_1.default(result);
            }
            return null;
        }
        catch (exception) {
            return null;
        }
    });
}
exports.getPaymentAccount = getPaymentAccount;
//# sourceMappingURL=getPaymentAccount.js.map