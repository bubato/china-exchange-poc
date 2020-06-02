import { Request, Response, NextFunction } from "express";
import { Role, User } from "../models/User";

export const isAuthorizeWithRole = (role: Role) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user } = req;
  if (!user) {
    return res.status(403).send("Forbidden");
  }

  if (user.roles.includes(role)) {
    next();
  } else {
    return res.status(403).send("Forbidden");
  }
};
