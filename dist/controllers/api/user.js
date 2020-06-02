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
const union_1 = __importDefault(require("lodash/union"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../../models/User");
/**
 * POST api/users
 */
exports.addUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, fullName, password } = req.body;
    try {
        const hashedPassword = md5_1.default(password);
        const result = yield User_1.User.create({
            fullName,
            username,
            hashedPassword,
            roles: [],
        });
        return res.status(200).json(result);
    }
    catch (e) {
        return res.status(500).json(e);
    }
});
/**
 * PUT api/users/:id/add_roles
 */
exports.addRoles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { roles } = req.body;
    const { id } = req.params;
    try {
        const user = yield User_1.User.findById(id);
        if (!user) {
            res.status(404).send("not found");
        }
        user.roles = union_1.default(user.roles, roles);
        if (roles.includes("merchandiser")) {
            user.appToken = jsonwebtoken_1.default.sign({
                fullName: user.fullName,
                id: user._id,
                username: user.username,
                isAppToken: true,
            }, "secret", { algorithm: "HS256" });
        }
        yield user.save();
        return res.status(200).json(user);
    }
    catch (e) {
        return res.status(500).json(e);
    }
});
/**
 *  PUT api/users/:id/remove_roles
 */
exports.removeRoles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { roles } = req.body;
    const { id } = req.params;
    try {
        const user = yield User_1.User.findById(id);
        if (!user) {
            res.status(404).send("not found");
        }
        user.roles = user.roles.filter((role) => {
            return !roles.includes(role);
        });
        yield user.save();
        return res.status(200).json(user);
    }
    catch (e) {
        return res.status(500).json(e);
    }
});
//# sourceMappingURL=user.js.map