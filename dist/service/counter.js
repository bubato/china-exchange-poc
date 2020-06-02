"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../util/logger"));
let counter = 0;
function getCounter() {
    return counter;
}
exports.getCounter = getCounter;
function increaseCounter(threshold) {
    logger_1.default.debug(`counter: ${counter}`);
    logger_1.default.debug(`threshold: ${threshold}`);
    if (counter >= threshold - 1) {
        counter = 0;
    }
    else {
        counter++;
    }
}
exports.increaseCounter = increaseCounter;
//# sourceMappingURL=counter.js.map