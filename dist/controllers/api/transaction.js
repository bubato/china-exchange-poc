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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const transactionService = __importStar(require("../../service/transaction"));
const Transaction_1 = require("../../models/Transaction");
const get_1 = __importDefault(require("lodash/get"));
const toNumber_1 = __importDefault(require("lodash/toNumber"));
function getPaginatedResult(paginatedTransactions) {
    return Object.assign(Object.assign({}, paginatedTransactions), { docs: paginatedTransactions.docs.map((paginatedTransaction) => {
            return Object.assign(Object.assign({}, paginatedTransaction.toObject()), { commision: toNumber_1.default(paginatedTransaction.amount) * 0.03, deposit: toNumber_1.default(paginatedTransaction.amount) * 0.97 });
        }) });
}
/**
 * GET /api/admin/transactions
 */
exports.getAllTransactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { statuses, page = 1, limit = 10 } = req.query;
        let filter = {};
        if (get_1.default(statuses, "length")) {
            filter = Object.assign(Object.assign({}, filter), { status: {
                    $in: statuses,
                } });
        }
        const transactions = yield Transaction_1.Transaction.paginate(filter, {
            populate: [
                {
                    path: "paymentMethod",
                    select: "name _id",
                },
                {
                    path: "receiverAccount",
                    select: "_id name owner accountNo accountOwnerName qrCodeUrl",
                },
                {
                    path: "merchandiser",
                    select: "_id fullName",
                },
            ],
            sort: {
                updatedAt: "desc",
            },
            page,
            limit,
        });
        return res.status(200).json(getPaginatedResult(transactions));
    }
    catch (e) {
        return res.status(500).send("error when getting transactions");
    }
});
/**
 * GET /api/customer/transactions
 */
exports.getCustomerTransactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { statuses, page = 1, limit = 10, customerId } = req.query;
        const { id } = req.user;
        let filter = {
            merchandiser: id,
            customerId,
        };
        if (get_1.default(statuses, "length")) {
            filter = Object.assign(Object.assign({}, filter), { status: {
                    $in: statuses,
                } });
        }
        const transactions = yield Transaction_1.Transaction.paginate(filter, {
            populate: [
                {
                    path: "paymentMethod",
                    select: "name _id",
                },
                {
                    path: "receiverAccount",
                    select: "_id name owner accountNo accountOwnerName qrCodeUrl",
                },
                {
                    path: "merchandiser",
                    select: "_id fullName",
                },
            ],
            sort: {
                updatedAt: "desc",
            },
            page,
            limit,
        });
        return res.status(200).json(getPaginatedResult(transactions));
    }
    catch (e) {
        return res.status(500).send("error when getting transactions");
    }
});
/**
 * GET /api/customer/transactions
 */
exports.getMerchandiserTransactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { statuses, page = 1, limit = 10 } = req.query;
        const { id } = req.user;
        let filter = {
            merchandiser: id,
        };
        if (get_1.default(statuses, "length")) {
            filter = Object.assign(Object.assign({}, filter), { status: {
                    $in: statuses,
                } });
        }
        const transactions = yield Transaction_1.Transaction.paginate(filter, {
            populate: [
                {
                    path: "paymentMethod",
                    select: "name _id",
                },
                {
                    path: "receiverAccount",
                    select: "_id name owner accountNo accountOwnerName qrCodeUrl",
                },
                {
                    path: "merchandiser",
                    select: "_id fullName",
                },
            ],
            sort: {
                updatedAt: "desc",
            },
            page,
            limit,
        });
        return res.status(200).json(getPaginatedResult(transactions));
    }
    catch (e) {
        return res.status(500).send("error when getting transactions");
    }
});
/**
 * GET /api/transactions/:id
 */
exports.getTransactionStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const transaction = yield Transaction_1.Transaction.findById(id)
            .populate({
            path: "paymentMethod",
            select: "name _id",
        })
            .populate({
            path: "receiverAccount",
            select: "_id name owner accountNo accountOwnerName qrCodeUrl",
        })
            .populate({
            path: "merchandiser",
            select: "_id fullName",
        });
        return res.status(200).json(transaction);
    }
    catch (e) {
        return res.status(500).send("error when getting transaction");
    }
});
/**
 * POST /api/transactions
 */
exports.createTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const payload = {
        userId: req.user.id,
        paymentType: req.body.paymentType,
        amount: toNumber_1.default(req.body.amount),
        customerId: req.body.customerId,
    };
    try {
        const result = yield transactionService.createTransaction(payload);
        if (!result) {
            return res.status(500).send("error when creating transaction");
        }
        return res.status(201).json(result);
    }
    catch (e) {
        return res.status(500).send("error when creating transaction");
    }
});
/**
 * PUT /api/transactions/:id/submit
 */
exports.submitTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = {
        id: req.params.id,
        senderAccountInfo: req.body.senderAccountInfo,
    };
    try {
        const transaction = yield transactionService.submitTransaction(payload);
        if (!transaction) {
            return res.status(500).send("error when submit transaction");
        }
        return res.status(200).json(transaction);
    }
    catch (e) {
        return res.status(500).send("error when submit transaction");
    }
});
/**
 * PUT /api/transactions/:id/approve
 */
exports.approveTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transaction = yield transactionService.approveTransaction(req.params.id);
        if (!transaction) {
            return res.status(500).send("error when approve transaction");
        }
        return res.status(200).json(transaction);
    }
    catch (e) {
        return res.status(500).send("error when approve transaction");
    }
});
/**
 * PUT /api/transactions/:id/reject
 */
exports.rejectTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { reason } = req.body;
    try {
        const transaction = yield transactionService.rejectTransaction(req.params.id, reason);
        if (!transaction) {
            return res.status(500).send("error when reject transaction");
        }
        return res.status(200).json(transaction);
    }
    catch (e) {
        return res.status(500).send("error when reject transaction");
    }
});
//# sourceMappingURL=transaction.js.map