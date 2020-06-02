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
const ConsumerWebhook_1 = require("../../models/ConsumerWebhook");
const User_1 = require("../../models/User");
exports.getAllConsumerWebhooks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const webhooks = yield ConsumerWebhook_1.ConsumerWebhook.find();
        return res.status(200).json(webhooks);
    }
    catch (e) {
        return res.status(500).json(e);
    }
});
exports.addConsumerWebhook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { url, userId } = req.body;
    try {
        const user = yield User_1.User.findOne({ _id: userId });
        if (!user) {
            return res.status(404).send("user not found");
        }
        const webhook = yield ConsumerWebhook_1.ConsumerWebhook.create({
            url,
            userId,
        });
        return res.status(201).json(webhook);
    }
    catch (e) {
        return res.status(500).json(e);
    }
});
exports.editConsumerWebhook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const form = req.body;
    try {
        const user = yield User_1.User.findOne({ _id: form.userId });
        if (!user && form.userId) {
            return res.status(404).send("user not found");
        }
        const webhook = yield ConsumerWebhook_1.ConsumerWebhook.findByIdAndUpdate(id, form, {
            new: true,
        });
        return res.status(201).json(webhook);
    }
    catch (e) {
        return res.status(500).json(e);
    }
});
exports.deleteConsumerWebhook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield ConsumerWebhook_1.ConsumerWebhook.deleteOne(id);
        return res.status(201).send("deleted");
    }
    catch (e) {
        return res.status(500).json(e);
    }
});
//# sourceMappingURL=consumerWebhook.js.map