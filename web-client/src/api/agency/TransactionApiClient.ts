import ChinaExchangeApiClient from "api/common/ChinaExchangeApiClient";

export default class TransactionApiClient extends ChinaExchangeApiClient {
  baseUrl = "api";

  getAllTransactions = (page: number, status?: string) => {
    const path = status ? `/agency/transactions?statuses=${status}&limit=10&page=${page}` : `/agency/transactions?limit=10&page=${page}`;
    return this.get(path);
  };
}
