import { Response, Request } from "express";
import { User } from "../../models/User";

/**
 * GET /api/accessToken
 */
export const getToken = async (req: Request, res: Response) => {
  try {
    const user = User.findOne({ accessToken: { $ne: null } });

    if (!user) {
      return res.status(404).send("not found");
    }

    return res.status(200).json({
      token: (await user).appToken,
    });
  } catch (e) {
    return res.status(404).send("not found");
  }
};
