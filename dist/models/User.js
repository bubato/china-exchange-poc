"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const userSchema = new mongoose_1.Schema({
    fullName: String,
    username: { type: String, unique: true },
    hashedPassword: String,
    appToken: String,
    roles: [String],
}, { timestamps: true });
exports.User = mongoose_1.default.model("User", userSchema);
//# sourceMappingURL=User.js.map