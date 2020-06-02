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
const consumerWebhookSchema = new mongoose_1.Schema({
    url: String,
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });
exports.ConsumerWebhook = mongoose_1.default.model("ConsumerWebhook", consumerWebhookSchema);
//# sourceMappingURL=ConsumerWebhook.js.map