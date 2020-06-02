import { PaymentAccount } from "../models/PaymentAccount";

export const resetDailyLimit = async () => {
  try {
    await PaymentAccount.updateMany({}, { dailyRequestedAmount: 0 });
    return true;
  } catch (e) {
    return false;
  }
};
