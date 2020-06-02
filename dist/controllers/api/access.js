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
const User_1 = require("../../models/User");
/**
 * GET /api/accessToken
 */
exports.getToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = User_1.User.findOne({ accessToken: { $ne: null } });
        if (!user) {
            return res.status(404).send("not found");
        }
        return res.status(200).json({
            token: (yield user).appToken,
        });
    }
    catch (e) {
        return res.status(404).send("not found");
    }
});
//# sourceMappingURL=access.js.map