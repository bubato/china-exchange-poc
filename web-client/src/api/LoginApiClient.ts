import ChinaExchangeApiClient from "api/common/ChinaExchangeApiClient";

export default class LoginApiClient extends ChinaExchangeApiClient {
  baseUrl = "api";

  login = (data: { username: string, password: string }) => {
    return this.post("/login", { data });
  };

  currentUser = () => {
    return this.get("/current_user");
  };

  currentMerchandiser = () => {
    return this.get("/customer/current_merchandiser");
  };
}
