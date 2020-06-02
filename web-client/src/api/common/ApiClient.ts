import $ from "jquery";

export interface RequestOptions {
  method: string,
  path: string,
  url?: string,
  data?: any,
  additionalRequestParams?: any,
  headers?: any
}

interface RequestParams {
  data?: any,
  additionalRequestParams?: any
}
export class BaseApiClient {
  baseUrl = "";

  wrapParamsKey = "";

  get(path: string, params?: RequestParams) {
    const options: RequestOptions = {
      method: "GET",
      path,
      ...params
    };
    return this._request(options);
  }

  post(path: string, params?: RequestParams) {
    const options: RequestOptions = {
      method: "POST",
      path,
      ...params
    };
    return this._request(options);
  }

  patch(path: string, params?: RequestParams) {
    const options: RequestOptions = {
      method: "PATCH",
      path,
      ...params
    };
    return this._request(options);
  }

  put(path: string, params?: RequestParams) {
    const options: RequestOptions = {
      method: "PUT",
      path,
      ...params
    };
    return this._request(options);
  }

  delete(path: string, params?: RequestParams) {
    const options: RequestOptions = {
      method: "DELETE",
      path,
      ...params
    };
    return this._request(options);
  }

  _request(options: RequestOptions) {
    const {
      method = "GET",
      path = "",
      url = null,
      data = {},
      additionalRequestParams = {},
      headers = {}
    } = options;
    const requestParams = {
      method,
      url: url || `${this.baseUrl}${path}`,
      headers,
      data: this._wrapData(data)
    };

    return $.ajax({ ...requestParams, ...additionalRequestParams });
  }

  _wrapData(data: any, wrapperKey = this.wrapParamsKey) {
    if (!wrapperKey) return data;

    const wrappedData = {};
    wrappedData[wrapperKey] = data;

    return wrappedData;
  }

  createFormData(fieldName: string, fieldValue: any) {
    const formData = new FormData();
    formData.append(fieldName, fieldValue);

    return formData;
  }

  formDataRequest({ path = "", formData = undefined, method = "PATCH" }) {
    return this._request({
      method,
      path,
      data: formData,
      additionalRequestParams: {
        contentType: false,
        processData: false
      }
    });
  }
}
