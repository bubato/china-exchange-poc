import { RequestOptions, BaseApiClient } from "api/common/ApiClient";

export default class ChinaExchangeApiClient extends BaseApiClient {
  static accessToken: string | null = "";

  static appToken: string | null = "";

  _request(options: RequestOptions) {
    const decoratedOptions = { ...options };

    decoratedOptions.headers = decoratedOptions.headers || {};
    decoratedOptions.headers.Authorization = `Bearer ${ChinaExchangeApiClient.accessToken}`;
    decoratedOptions.headers["X-API-Key"] = ChinaExchangeApiClient.appToken;
    return super._request(decoratedOptions);
  }
}
