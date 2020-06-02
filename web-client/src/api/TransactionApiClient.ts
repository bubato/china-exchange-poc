import ChinaExchangeApiClient from "api/common/ChinaExchangeApiClient";

export default class TransactionApiClient extends ChinaExchangeApiClient {
  baseUrl = "api/transactions";

  getAllTransactions = (status?: string) => {
    const path = status ? `?status=${status}` : "/";
    return this.get(path);
  };

  createTransaction = (data: any) => {
    return this.post("/", { data });
  };
}
