import { Response, Request } from "express";
import { PaymentMethod } from "../../models/PaymentMethod";
import { getAvailableAccountsCount } from "../../service/getPaymentAccount";

/**
 * GET /api/payment_methods
 */
export const getPaymentMethods = async (req: Request, res: Response) => {
  try {
    const result = await PaymentMethod.find({});

    return res.status(200).json(result);
  } catch (e) {
    return res.status(500).json(e);
  }
};

/**
 * POST /api/payment_methods
 */
export const postPaymentMethod = async (req: Request, res: Response) => {
  const { name } = req.body;

  try {
    const result = await PaymentMethod.create({ name });

    return res.status(201).json(result);
  } catch (e) {
    res.status(500).json(e);
  }
};

/**
 * PUT /api/payment_methods
 */

export const editPaymentMethod = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const result = await PaymentMethod.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    return res.status(201).json(result);
  } catch (e) {
    res.status(500).json(e);
  }
};

/**
 * API GET /api/payment_method_avaibilities
 */

export const getPaymentMethodAvaibilities = async (
  req: Request,
  res: Response
) => {
  try {
    const methods = await PaymentMethod.find({});

    const results = [];
    for (const method of methods) {
      const methodAvaibility = await getAvailableAccountsCount(method._id);
      results.push({
        ...method.toObject(),
        available: methodAvaibility > 0,
      });
    }

    return res.status(200).json(results);
  } catch (e) {
    return res.status(500).json(e);
  }
};
