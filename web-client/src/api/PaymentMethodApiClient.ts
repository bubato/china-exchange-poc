import ChinaExchangeApiClient from "api/common/ChinaExchangeApiClient";

export default class PaymentMethodApiClient extends ChinaExchangeApiClient {
  baseUrl = "api/payment-methods";

  getAllMethods = () => {
    return this.get("/");
  };
}
