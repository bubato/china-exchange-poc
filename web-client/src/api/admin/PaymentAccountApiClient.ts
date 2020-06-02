import ChinaExchangeApiClient from "api/common/ChinaExchangeApiClient";

export default class PaymentAccountApiClient extends ChinaExchangeApiClient {
  baseUrl = "api/payment-accounts";

  getAllPaymentAccout = () => {
    return this.get("");
  };

  createPaymentAccount = (formData: any) => {
    return this.formDataRequest({
      method: "POST",
      path: "/",
      formData
    });
  };
}
