import { Request, Response } from "express";
import { seedAdmin, seedAgency, seedBuyer } from "../../seed/user";

export const seedUser = async (req: Request, res: Response) => {
  try {
    const admin = await seedAdmin();
    const agency = await seedAgency();
    const buyer = await seedBuyer();
    return res.status(201).json({ admin, agency, buyer });
  } catch (e) {
    return res.status(500).send("error");
  }
};
