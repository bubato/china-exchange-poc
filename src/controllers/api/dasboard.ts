import { Response, Request } from "express";
import { Transaction } from "../../models/Transaction";
import mongoose from "mongoose";
import head from "lodash/head";
import get from "lodash/get";

export type DashboardDto = {
  deposit: number;
  paid: number;
  balance: number;
};

export type DepositAgregate = {
  deposit: number;
};

export const getAdminDashboard = async (req: Request, res: Response) => {
  try {
    const aggregateResults: DepositAgregate[] = await Transaction.aggregate([
      {
        $match: {
          status: "approved",
        },
      },
      {
        $group: {
          _id: null,
          deposit: {
            $sum: "$amount",
          },
        },
      },
    ]).exec();

    const aggregateResult = head(aggregateResults);

    const response: DashboardDto = {
      deposit: get(aggregateResult, "deposit", 0) || 0,
      paid: 0,
      balance: 0,
    };

    res.status(200).json(response);
  } catch (e) {
    res.status(500).send("error");
  }
};

export const getAgencyDashboard = async (req: Request, res: Response) => {
  try {
    const aggregateResults: DepositAgregate[] = await Transaction.aggregate([
      {
        $match: {
          status: "approved",
        },
      },
      {
        $group: {
          _id: null,
          deposit: {
            $sum: "$amount",
          },
        },
      },
    ]).exec();

    const aggregateResult = head(aggregateResults);

    const response: DashboardDto = {
      deposit: get(aggregateResult, "deposit", 0) || 0,
      paid: 0,
      balance: 0,
    };

    return res.status(200).json(response);
  } catch (e) {
    res.status(500).send("error");
  }
};

export const getMerchandiserDashboard = async (req: Request, res: Response) => {
  const { id } = req.user;
  try {
    const aggregateResults: DepositAgregate[] = await Transaction.aggregate([
      {
        $match: {
          status: "approved",
          merchandiser: mongoose.Types.ObjectId(id),
        },
      },
      {
        $group: {
          _id: null,
          deposit: {
            $sum: "$amount",
          },
        },
      },
    ]).exec();

    const aggregateResult = head(aggregateResults);

    const response: DashboardDto = {
      deposit: get(aggregateResult, "deposit", 0) || 0,
      paid: 0,
      balance: 0,
    };

    return res.status(200).json(response);
  } catch (e) {
    res.status(500).send(e.message);
  }
};
