import { Response, Request } from "express";
import { validationResult } from "express-validator";
import * as transactionService from "../../service/transaction";
import { PaginateResult } from "mongoose";
import {
  Transaction,
  TransactionDto,
  TransactionDocument,
} from "../../models/Transaction";
import get from "lodash/get";
import toNumber from "lodash/toNumber";

function getPaginatedResult(
  paginatedTransactions: PaginateResult<TransactionDocument>
) {
  return {
    ...paginatedTransactions,
    docs: paginatedTransactions.docs.map((paginatedTransaction) => {
      return {
        ...paginatedTransaction.toObject(),
        commision: toNumber(paginatedTransaction.amount) * 0.03,
        deposit: toNumber(paginatedTransaction.amount) * 0.97,
      };
    }) as TransactionDto[],
  };
}

/**
 * GET /api/admin/transactions
 */
export const getAllTransactions = async (req: Request, res: Response) => {
  try {
    const { statuses, page = 1, limit = 10 } = req.query;
    let filter: {
      status?: object;
    } = {};

    if (get(statuses, "length")) {
      filter = {
        ...filter,
        status: {
          $in: statuses,
        },
      };
    }

    const transactions = await Transaction.paginate(filter, {
      populate: [
        {
          path: "paymentMethod",
          select: "name _id",
        },
        {
          path: "receiverAccount",
          select: "_id name owner accountNo accountOwnerName qrCodeUrl",
        },
        {
          path: "merchandiser",
          select: "_id fullName",
        },
      ],
      sort: {
        updatedAt: "desc",
      },
      page,
      limit,
    });

    return res.status(200).json(getPaginatedResult(transactions));
  } catch (e) {
    return res.status(500).send("error when getting transactions");
  }
};

/**
 * GET /api/customer/transactions
 */
export const getCustomerTransactions = async (req: Request, res: Response) => {
  try {
    const { statuses, page = 1, limit = 10, customerId } = req.query;

    const { id } = req.user;

    let filter: {
      merchandiser: string;
      customerId: string;
      status?: object;
    } = {
      merchandiser: id,
      customerId,
    };

    if (get(statuses, "length")) {
      filter = {
        ...filter,
        status: {
          $in: statuses,
        },
      };
    }

    const transactions = await Transaction.paginate(filter, {
      populate: [
        {
          path: "paymentMethod",
          select: "name _id",
        },
        {
          path: "receiverAccount",
          select: "_id name owner accountNo accountOwnerName qrCodeUrl",
        },
        {
          path: "merchandiser",
          select: "_id fullName",
        },
      ],
      sort: {
        updatedAt: "desc",
      },
      page,
      limit,
    });

    return res.status(200).json(getPaginatedResult(transactions));
  } catch (e) {
    return res.status(500).send("error when getting transactions");
  }
};

/**
 * GET /api/customer/transactions
 */
export const getMerchandiserTransactions = async (
  req: Request,
  res: Response
) => {
  try {
    const { statuses, page = 1, limit = 10 } = req.query;

    const { id } = req.user;

    let filter: {
      merchandiser: string;
      status?: object;
    } = {
      merchandiser: id,
    };

    if (get(statuses, "length")) {
      filter = {
        ...filter,
        status: {
          $in: statuses,
        },
      };
    }

    const transactions = await Transaction.paginate(filter, {
      populate: [
        {
          path: "paymentMethod",
          select: "name _id",
        },
        {
          path: "receiverAccount",
          select: "_id name owner accountNo accountOwnerName qrCodeUrl",
        },
        {
          path: "merchandiser",
          select: "_id fullName",
        },
      ],
      sort: {
        updatedAt: "desc",
      },
      page,
      limit,
    });

    return res.status(200).json(getPaginatedResult(transactions));
  } catch (e) {
    return res.status(500).send("error when getting transactions");
  }
};

/**
 * GET /api/transactions/:id
 */
export const getTransactionStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const transaction = await Transaction.findById(id)
      .populate({
        path: "paymentMethod",
        select: "name _id",
      })
      .populate({
        path: "receiverAccount",
        select: "_id name owner accountNo accountOwnerName qrCodeUrl",
      })
      .populate({
        path: "merchandiser",
        select: "_id fullName",
      });

    return res.status(200).json(transaction);
  } catch (e) {
    return res.status(500).send("error when getting transaction");
  }
};

/**
 * POST /api/transactions
 */
export const createTransaction = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const payload: transactionService.TransactionPayload = {
    userId: req.user.id,
    paymentType: req.body.paymentType,
    amount: toNumber(req.body.amount),
    customerId: req.body.customerId,
  };

  try {
    const result = await transactionService.createTransaction(payload);
    if (!result) {
      return res.status(500).send("error when creating transaction");
    }

    return res.status(201).json(result);
  } catch (e) {
    return res.status(500).send("error when creating transaction");
  }
};

/**
 * PUT /api/transactions/:id/submit
 */
export const submitTransaction = async (req: Request, res: Response) => {
  const payload = {
    id: req.params.id,
    senderAccountInfo: req.body.senderAccountInfo,
  };

  try {
    const transaction = await transactionService.submitTransaction(payload);
    if (!transaction) {
      return res.status(500).send("error when submit transaction");
    }

    return res.status(200).json(transaction);
  } catch (e) {
    return res.status(500).send("error when submit transaction");
  }
};

/**
 * PUT /api/transactions/:id/approve
 */
export const approveTransaction = async (req: Request, res: Response) => {
  try {
    const transaction = await transactionService.approveTransaction(
      req.params.id
    );
    if (!transaction) {
      return res.status(500).send("error when approve transaction");
    }

    return res.status(200).json(transaction);
  } catch (e) {
    return res.status(500).send("error when approve transaction");
  }
};

/**
 * PUT /api/transactions/:id/reject
 */
export const rejectTransaction = async (req: Request, res: Response) => {
  const { reason } = req.body;
  try {
    const transaction = await transactionService.rejectTransaction(
      req.params.id,
      reason
    );
    if (!transaction) {
      return res.status(500).send("error when reject transaction");
    }

    return res.status(200).json(transaction);
  } catch (e) {
    return res.status(500).send("error when reject transaction");
  }
};
