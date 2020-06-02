import { Response, Request } from "express";
import { PaymentAccount } from "../../models/PaymentAccount";
import { PaymentMethod } from "../../models/PaymentMethod";
import lowerCase from "lodash/lowerCase";
import toNumber from "lodash/toNumber";

/**
 * GET /api/payment_accounts
 */
export const getPaymentAccounts = async (req: Request, res: Response) => {
  try {
    const result = await PaymentAccount.find({}).populate({
      path: "paymentMethod",
      select: "name _id",
    });

    return res.status(200).json(result);
  } catch (e) {
    return res.status(500).json(e);
  }
};

/**
 * POST /api/payment_accounts
 */
export const postPaymentAccount = async (req: Request, res: Response) => {
  const {
    name,
    paymentMethodId,
    accountNo,
    accountOwnerName,
    dailyLimit,
  } = req.body;

  try {
    const method = await PaymentMethod.findById(paymentMethodId);

    if (lowerCase(method.name) !== lowerCase("bank") && !req.file) {
      return res.status(400).send("must have qr code");
    }

    const result = await PaymentAccount.create({
      name,
      paymentMethod: paymentMethodId,
      accountNo,
      accountOwnerName,
      dailyLimit: toNumber(dailyLimit),
      dailyRequestedAmount: 0,
      qrCodeUrl: req.file ? `/images/uploads/${req.file.filename}` : null,
    });

    return res.status(201).json(result);
  } catch (e) {
    return res.status(500).json(e);
  }
};
