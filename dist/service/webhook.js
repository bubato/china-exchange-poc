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
const axios_1 = __importDefault(require("axios"));
const ConsumerWebhook_1 = require("../models/ConsumerWebhook");
const logger_1 = __importDefault(require("../util/logger"));
const get_1 = __importDefault(require("lodash/get"));
exports.sendWebhookToUser = (userId, transaction) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.default.debug("prepare to send webhook");
        const webhooks = yield ConsumerWebhook_1.ConsumerWebhook.find({ userId });
        webhooks.forEach((webhook) => {
            const payload = {
                _id: transaction._id,
                paymentMethod: get_1.default(transaction, "paymentMethod.name", null),
                timestamp: Math.round(new Date().getTime() / 1000),
                amount: transaction.amount,
                customerId: transaction.customerId,
                status: transaction.status,
            };
            logger_1.default.debug(`sending request to ${webhook.url} with content ${JSON.stringify(payload)}`);
            axios_1.default
                .post(webhook.url, JSON.stringify(payload))
                .then((response) => {
                logger_1.default.info(`sent to webhook ${webhook.url} successfully with response ${JSON.stringify(response.data)}`);
            })
                .catch((e) => {
                logger_1.default.info(`sent to webhook ${webhook.url} failure with error 
              ${e.message}
            `);
            });
        });
        logger_1.default.debug("finished to send webhook");
    }
    catch (e) {
        logger_1.default.debug(`error when sending webhook, details : ${JSON.stringify(e)}`);
    }
});
//# sourceMappingURL=webhook.js.map