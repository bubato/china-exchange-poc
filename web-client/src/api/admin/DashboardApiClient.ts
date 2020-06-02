import ChinaExchangeApiClient from "api/common/ChinaExchangeApiClient";

export default class DashboardApiClient extends ChinaExchangeApiClient {
  baseUrl = "api/admin/dashboard";

  getInformationDashboard = () => {
    return this.get("");
  };
}
