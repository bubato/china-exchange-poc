import { Response, Request } from "express";
import md5 from "md5";
import union from "lodash/union";
import jwt from "jsonwebtoken";

import { User } from "../../models/User";

/**
 * POST api/users
 */

export const addUser = async (req: Request, res: Response) => {
  const { username, fullName, password } = req.body;
  try {
    const hashedPassword = md5(password);
    const result = await User.create({
      fullName,
      username,
      hashedPassword,
      roles: [],
    });

    return res.status(200).json(result);
  } catch (e) {
    return res.status(500).json(e);
  }
};

/**
 * PUT api/users/:id/add_roles
 */

export const addRoles = async (req: Request, res: Response) => {
  const { roles } = req.body;
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      res.status(404).send("not found");
    }

    user.roles = union(user.roles, roles);

    if (roles.includes("merchandiser")) {
      user.appToken = jwt.sign(
        {
          fullName: user.fullName,
          id: user._id,
          username: user.username,
          isAppToken: true,
        },
        "secret",
        { algorithm: "HS256" }
      );
    }

    await user.save();

    return res.status(200).json(user);
  } catch (e) {
    return res.status(500).json(e);
  }
};

/**
 *  PUT api/users/:id/remove_roles
 */
export const removeRoles = async (req: Request, res: Response) => {
  const { roles } = req.body;
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      res.status(404).send("not found");
    }

    user.roles = user.roles.filter((role) => {
      return !(roles as string[]).includes(role);
    });

    await user.save();

    return res.status(200).json(user);
  } catch (e) {
    return res.status(500).json(e);
  }
};
