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
const node_cron_1 = __importDefault(require("node-cron"));
const resetDailyLimit_1 = require("../service/resetDailyLimit");
const logger_1 = __importDefault(require("../util/logger"));
const task = node_cron_1.default.schedule("0 0 * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default.debug("starting reset daily limit");
    const result = yield resetDailyLimit_1.resetDailyLimit();
    logger_1.default.debug(`result: ${result}`);
}), {
    scheduled: true,
    timezone: "Asia/Shanghai",
});
exports.startResetDailyLimitJob = () => {
    console.log("cron job: startResetDailyLimitJob triggered");
    task.start();
};
//# sourceMappingURL=resetDailyLimit.js.map