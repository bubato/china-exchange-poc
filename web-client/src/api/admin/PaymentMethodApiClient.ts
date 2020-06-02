import ChinaExchangeApiClient from "api/common/ChinaExchangeApiClient";

export default class PaymentMethodApiClient extends ChinaExchangeApiClient {
  baseUrl = "api/payment-methods";

  getAllPaymentMethod = () => {
    return this.get("");
  };
}
