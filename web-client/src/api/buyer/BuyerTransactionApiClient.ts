import ChinaExchangeApiClient from "api/common/ChinaExchangeApiClient";

export default class BuyerTransactionApiClient extends ChinaExchangeApiClient {
  baseUrl = "api";

  getAllTransactions = (customerId: string, page: number, status?: any) => {
    const path = status ? `/customer/transactions?statuses=${status}&customerId=${customerId}&limit=10&page=${page}` : `/customer/transactions?customerId=${customerId}&limit=10&page=${page}`;
    return this.get(path);
  };

  createTransaction = (data: any) => {
    return this.post("/transactions", { data });
  };

  submitTransaction = (id: string, data: any) => {
    return this.put(`/transactions/${id}/submit`, { data });
  };

  methodAvaibilities = () => {
    return this.get("/customer/payment-method-avaibilities");
  };
}
