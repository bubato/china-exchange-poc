import { Request, Response } from "express";
import md5 from "md5";
import jwt from "jsonwebtoken";
import { User } from "../../models/User";
import logger from "../../util/logger";

/**
 * API api/login
 */

export const postLogin = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = md5(password);
    const user = await User.findOne({ username, hashedPassword });

    if (!user) {
      return res.status(401).send("Unauthorization");
    }

    const accessToken = jwt.sign(
      {
        fullName: user.fullName,
        id: user._id,
        username: user.username,
        isAppToken: false,
      },
      "secret",
      { algorithm: "HS256" }
    );
    logger.debug(`login success for ${username}`);
    return res.status(200).json({ token: accessToken, type: "Bearer" });
  } catch (e) {
    logger.debug(`exeptions: ${e.message}`);
    return res.status(401).send("Unauthorization");
  }
};

/**
 * API api/current_user
 */
export const getCurrentUser = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).send("");
  }
  return res.status(200).json(req.user);
};
