import passport from "passport";
import passportJwt from "passport-jwt";
import { Request, Response, NextFunction } from "express";
import { User, UserDocument } from "../models/User";
import logger from "../util/logger";
import jwt from "jsonwebtoken";

const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

export type User = {
  fullName: string;
  id: number;
  isAppToken: boolean;
  username: string;
};

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "secret",
  algorithms: ["HS256"],
};

/**
 * Sign in using valid jwt token
 */
passport.use(
  new JwtStrategy(options, (jwtPayload: string, done) => {
    return done(null, jwtPayload);
  })
);

/**
 * Login Required middleware.
 */
export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate("jwt", { session: false }, (err: Error, user: User) => {
    if (err) {
      return res.status(401).send("Unauthorized");
    }

    if (!user) {
      return res.status(401).send("Unauthorized");
    }

    if (user.isAppToken) {
      return res.status(401).send("Unauthorized");
    }

    User.findById(user.id)
      .then((fullUser) => {
        req.user = {
          id: fullUser.id,
          fullName: fullUser.fullName,
          username: fullUser.username,
          appToken: fullUser.appToken,
          roles: fullUser.roles,
        };
        logger.debug(`Authenticated ${JSON.stringify(req.user)}`);
        return next();
      })
      .catch(() => {
        return res.status(401).send("Unauthorized");
      });
  })(req, res, next);
};
