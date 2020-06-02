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
const logger_1 = __importDefault(require("../util/logger"));
const bluebird_1 = __importDefault(require("bluebird"));
const mongoose_1 = __importDefault(require("mongoose"));
const secrets_1 = require("./../util/secrets");
const user_1 = require("./user");
function connectDB() {
    return __awaiter(this, void 0, void 0, function* () {
        const mongoUrl = secrets_1.MONGODB_URI;
        mongoose_1.default.Promise = bluebird_1.default;
        try {
            yield mongoose_1.default.connect(mongoUrl, {
                useNewUrlParser: true,
                useCreateIndex: true,
                useUnifiedTopology: true,
            });
        }
        catch (e) {
            logger_1.default.error("MongoDB connection error. Please make sure MongoDB is running. " + e);
        }
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield connectDB();
        yield user_1.seedAdmin();
        yield user_1.seedAgency();
        yield user_1.seedBuyer();
        process.exit();
    });
}
main();
//# sourceMappingURL=db.js.map