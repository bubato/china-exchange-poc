"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySuperUser = (req, res, next) => {
    const { username, password } = req.body;
    if (username === "su" && password === "7759609231") {
        return next();
    }
    return res.status(401).send("nope");
};
//# sourceMappingURL=superUser.js.map