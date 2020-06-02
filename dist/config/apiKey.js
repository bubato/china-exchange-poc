"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../models/User");
const logger_1 = __importDefault(require("../util/logger"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * Login Required middleware.
 */
exports.isAuthenticated = (req, res, next) => {
    const token = req.get("x-api-Key");
    if (!token) {
        return res.status(401).send("Unauthorized");
    }
    try {
        const decodedUser = jsonwebtoken_1.default.verify(token, "secret", {
            algorithms: ["HS256"],
        });
        User_1.User.findById(decodedUser.id)
            .then((fullUser) => {
            if (!fullUser.roles.includes("merchandiser")) {
                return res.status(401).send("Unauthorized");
            }
            if (!decodedUser.isAppToken) {
                return res.status(401).send("Unauthorized");
            }
            req.user = {
                id: fullUser.id,
                fullName: fullUser.fullName,
                username: fullUser.username,
                appToken: fullUser.appToken,
                roles: fullUser.roles,
            };
            logger_1.default.debug(`Authenticated API KEY ${JSON.stringify(req.user)}`);
            return next();
        })
            .catch(() => {
            return res.status(401).send("Unauthorized");
        });
    }
    catch (e) {
        return res.status(401).send("Unauthorized");
    }
};
//# sourceMappingURL=apiKey.js.map