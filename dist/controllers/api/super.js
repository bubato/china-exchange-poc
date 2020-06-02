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
const user_1 = require("../../seed/user");
exports.seedUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admin = yield user_1.seedAdmin();
        const agency = yield user_1.seedAgency();
        const buyer = yield user_1.seedBuyer();
        return res.status(201).json({ admin, agency, buyer });
    }
    catch (e) {
        return res.status(500).send("error");
    }
});
//# sourceMappingURL=super.js.map