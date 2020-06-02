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
const Transaction_1 = require("../../models/Transaction");
const mongoose_1 = __importDefault(require("mongoose"));
const head_1 = __importDefault(require("lodash/head"));
const get_1 = __importDefault(require("lodash/get"));
exports.getAdminDashboard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const aggregateResults = yield Transaction_1.Transaction.aggregate([
            {
                $match: {
                    status: "approved",
                },
            },
            {
                $group: {
                    _id: null,
                    deposit: {
                        $sum: "$amount",
                    },
                },
            },
        ]).exec();
        const aggregateResult = head_1.default(aggregateResults);
        const response = {
            deposit: get_1.default(aggregateResult, "deposit", 0) || 0,
            paid: 0,
            balance: 0,
        };
        res.status(200).json(response);
    }
    catch (e) {
        res.status(500).send("error");
    }
});
exports.getAgencyDashboard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const aggregateResults = yield Transaction_1.Transaction.aggregate([
            {
                $match: {
                    status: "approved",
                },
            },
            {
                $group: {
                    _id: null,
                    deposit: {
                        $sum: "$amount",
                    },
                },
            },
        ]).exec();
        const aggregateResult = head_1.default(aggregateResults);
        const response = {
            deposit: get_1.default(aggregateResult, "deposit", 0) || 0,
            paid: 0,
            balance: 0,
        };
        return res.status(200).json(response);
    }
    catch (e) {
        res.status(500).send("error");
    }
});
exports.getMerchandiserDashboard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    try {
        const aggregateResults = yield Transaction_1.Transaction.aggregate([
            {
                $match: {
                    status: "approved",
                    merchandiser: mongoose_1.default.Types.ObjectId(id),
                },
            },
            {
                $group: {
                    _id: null,
                    deposit: {
                        $sum: "$amount",
                    },
                },
            },
        ]).exec();
        const aggregateResult = head_1.default(aggregateResults);
        const response = {
            deposit: get_1.default(aggregateResult, "deposit", 0) || 0,
            paid: 0,
            balance: 0,
        };
        return res.status(200).json(response);
    }
    catch (e) {
        res.status(500).send(e.message);
    }
});
//# sourceMappingURL=dasboard.js.map