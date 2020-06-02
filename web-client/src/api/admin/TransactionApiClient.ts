import ChinaExchangeApiClient from "api/common/ChinaExchangeApiClient";

type RejectTransPayload = {
  reason: string;
};

export default class TransactionApiClient extends ChinaExchangeApiClient {
  baseUrl = "api";

  getAllTransactions = (page: number, status?: string) => {
    const path = status ? `/admin/transactions?statuses=${status}&limit=10&page=${page}` : "/";
    return this.get(path);
  };

  createTransaction = (data: any) => {
    return this.post("/admin/transactions", { data });
  };

  completeTransaction = (action: string, data: string, values?: RejectTransPayload) => {
    return this.put(`/transactions/${data}/${action}`, {
      data: values
    });
  };
}
