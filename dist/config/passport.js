"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = __importDefault(require("passport-jwt"));
const User_1 = require("../models/User");
const logger_1 = __importDefault(require("../util/logger"));
const JwtStrategy = passport_jwt_1.default.Strategy;
const ExtractJwt = passport_jwt_1.default.ExtractJwt;
const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: "secret",
    algorithms: ["HS256"],
};
/**
 * Sign in using valid jwt token
 */
passport_1.default.use(new JwtStrategy(options, (jwtPayload, done) => {
    return done(null, jwtPayload);
}));
/**
 * Login Required middleware.
 */
exports.isAuthenticated = (req, res, next) => {
    passport_1.default.authenticate("jwt", { session: false }, (err, user) => {
        if (err) {
            return res.status(401).send("Unauthorized");
        }
        if (!user) {
            return res.status(401).send("Unauthorized");
        }
        if (user.isAppToken) {
            return res.status(401).send("Unauthorized");
        }
        User_1.User.findById(user.id)
            .then((fullUser) => {
            req.user = {
                id: fullUser.id,
                fullName: fullUser.fullName,
                username: fullUser.username,
                appToken: fullUser.appToken,
                roles: fullUser.roles,
            };
            logger_1.default.debug(`Authenticated ${JSON.stringify(req.user)}`);
            return next();
        })
            .catch(() => {
            return res.status(401).send("Unauthorized");
        });
    })(req, res, next);
};
//# sourceMappingURL=passport.js.map