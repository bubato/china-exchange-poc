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
const md5_1 = __importDefault(require("md5"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../../models/User");
const logger_1 = __importDefault(require("../../util/logger"));
/**
 * API api/login
 */
exports.postLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const hashedPassword = md5_1.default(password);
        const user = yield User_1.User.findOne({ username, hashedPassword });
        if (!user) {
            return res.status(401).send("Unauthorization");
        }
        const accessToken = jsonwebtoken_1.default.sign({
            fullName: user.fullName,
            id: user._id,
            username: user.username,
            isAppToken: false,
        }, "secret", { algorithm: "HS256" });
        logger_1.default.debug(`login success for ${username}`);
        return res.status(200).json({ token: accessToken, type: "Bearer" });
    }
    catch (e) {
        logger_1.default.debug(`exeptions: ${e.message}`);
        return res.status(401).send("Unauthorization");
    }
});
/**
 * API api/current_user
 */
exports.getCurrentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return res.status(401).send("");
    }
    return res.status(200).json(req.user);
});
//# sourceMappingURL=authen.js.map