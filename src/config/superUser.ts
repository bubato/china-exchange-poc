import { Request, Response, NextFunction } from "express";

export const verifySuperUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body;

  if (username === "su" && password === "7759609231") {
    return next();
  }
  return res.status(401).send("nope");
};
