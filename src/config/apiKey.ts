import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";
import logger from "../util/logger";
import jwt from "jsonwebtoken";
export type User = {
  fullName: string;
  id: number;
  isAppToken: boolean;
  username: string;
};

/**
 * Login Required middleware.
 */
export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.get("x-api-Key");

  if (!token) {
    return res.status(401).send("Unauthorized");
  }

  try {
    const decodedUser: User = jwt.verify(token, "secret", {
      algorithms: ["HS256"],
    }) as User;

    User.findById(decodedUser.id)
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
        logger.debug(`Authenticated API KEY ${JSON.stringify(req.user)}`);
        return next();
      })
      .catch(() => {
        return res.status(401).send("Unauthorized");
      });
  } catch (e) {
    return res.status(401).send("Unauthorized");
  }
};
