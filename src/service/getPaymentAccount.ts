import {
  PaymentAccount,
  PaymentAccountDocument,
} from "../models/PaymentAccount";
import { getCounter, increaseCounter } from "./counter";
import head from "lodash/head";
import { PaymentMethod } from "../models/PaymentMethod";
import logger from "../util/logger";

export async function getAvailableAccountsCount(paymentMethodId: string) {
  try {
    const count: number = await PaymentAccount.find({
      paymentMethod: paymentMethodId,
      $expr: {
        $lt: ["$dailyRequestedAmount", "$dailyLimit"],
      },
    }).count();

    return count;
  } catch {
    return 0;
  }
}

export async function getPaymentAccount(paymentMethod: string, amount: number) {
  try {
    const method = await PaymentMethod.findOne({ name: paymentMethod });

    logger.debug(`selecte payment method is ${JSON.stringify(method)}`);

    const count: number = await PaymentAccount.find({
      paymentMethod: method._id,
      $expr: {
        $lt: [{ $add: ["$dailyRequestedAmount", amount] }, "$dailyLimit"],
      },
    }).count();

    logger.debug(`available accounts is ${count}`);

    if (count === 0) {
      return null;
    }

    increaseCounter(count);

    const result: PaymentAccountDocument[] = await PaymentAccount.find({
      paymentMethod: method._id,
      $expr: {
        $lt: [{ $add: ["$dailyRequestedAmount", amount] }, "$dailyLimit"],
      },
    })
      .skip(getCounter())
      .limit(1)
      .populate("paymentMethod");

    if (result.length) {
      logger.debug(`picked account is  is ${JSON.stringify(head(result))}`);
      return head(result);
    }

    return null;
  } catch (exception) {
    return null;
  }
}
