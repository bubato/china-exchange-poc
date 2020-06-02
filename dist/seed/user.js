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
const User_1 = require("../models/User");
const md5_1 = __importDefault(require("md5"));
const logger_1 = __importDefault(require("../util/logger"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function seedAdmin() {
    return __awaiter(this, void 0, void 0, function* () {
        logger_1.default.debug("starting seed admin");
        const admin = {
            fullName: "John Donkisoft",
            username: "admin",
            hashedPassword: md5_1.default("123456"),
            roles: ["admin"],
        };
        try {
            const foundAdmin = yield User_1.User.findOne({
                fullName: admin.fullName,
                username: admin.username,
            });
            logger_1.default.debug(`foundAdmin = ${foundAdmin.toJSON()}`);
            foundAdmin.fullName = admin.fullName;
            foundAdmin.username = admin.username;
            foundAdmin.hashedPassword = admin.hashedPassword;
            foundAdmin.roles = admin.roles;
            yield foundAdmin.save();
            logger_1.default.debug("update admin success");
            return foundAdmin;
        }
        catch (e) {
            yield User_1.User.create(admin);
            logger_1.default.debug("create admin success");
            return null;
        }
    });
}
exports.seedAdmin = seedAdmin;
function seedAgency() {
    return __awaiter(this, void 0, void 0, function* () {
        logger_1.default.debug("starting seed agency");
        const agency = {
            fullName: "Woang Walao",
            username: "agency",
            hashedPassword: md5_1.default("123456"),
            roles: ["agency"],
        };
        try {
            const foundAgency = yield User_1.User.findOne({
                fullName: agency.fullName,
                username: agency.username,
            });
            logger_1.default.debug(`foundAgency = ${foundAgency.toJSON()}`);
            foundAgency.fullName = agency.fullName;
            foundAgency.username = agency.username;
            foundAgency.hashedPassword = agency.hashedPassword;
            foundAgency.roles = agency.roles;
            logger_1.default.debug("update agency success");
            return foundAgency;
        }
        catch (e) {
            const createdAgency = yield User_1.User.create(agency);
            logger_1.default.debug("create agency success");
            return createdAgency;
        }
    });
}
exports.seedAgency = seedAgency;
function seedBuyer() {
    return __awaiter(this, void 0, void 0, function* () {
        logger_1.default.debug("starting seed merchandiser");
        const consumer = {
            fullName: "Mah Cho",
            username: "merchandiser",
            hashedPassword: md5_1.default("123456"),
            roles: ["merchandiser"],
        };
        try {
            const foundBuyer = yield User_1.User.findOne({
                fullName: consumer.fullName,
                username: consumer.username,
            });
            logger_1.default.debug(`found buyer = ${foundBuyer.toJSON()}`);
            foundBuyer.fullName = consumer.fullName;
            foundBuyer.username = consumer.username;
            foundBuyer.hashedPassword = consumer.hashedPassword;
            foundBuyer.roles = consumer.roles;
            foundBuyer.appToken = jsonwebtoken_1.default.sign({
                fullName: consumer.fullName,
                id: foundBuyer.id,
                username: consumer.username,
                isAppToken: true,
            }, "secret", { algorithm: "HS256" });
            yield foundBuyer.save();
            logger_1.default.debug("update merchandiser success");
            return foundBuyer;
        }
        catch (e) {
            const createdConsumer = yield User_1.User.create(consumer);
            createdConsumer.appToken = jsonwebtoken_1.default.sign({
                fullName: consumer.fullName,
                id: createdConsumer.id,
                username: consumer.username,
                isAppToken: true,
            }, "secret", { algorithm: "HS256" });
            yield createdConsumer.save();
            logger_1.default.debug("create merchandiser success");
            return createdConsumer;
        }
    });
}
exports.seedBuyer = seedBuyer;
//# sourceMappingURL=user.js.map