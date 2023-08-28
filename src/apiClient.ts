import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import PaymentResource from "./ressources/Payment";

export const apiBase = "https://api.transfapp.com";
export const defaultAuthHeaderBearer = "Api-Transfa-Key";

export class TransfaAPIClient {
  private baseUrl: string = apiBase;
  private authHeaderPrefix: string = defaultAuthHeaderBearer;
  private version: string = "1.0.0";
  constructor(
    private timeout: number = 5000,
    private verifySSL: boolean = true,
    private apiKey: string = "YOUR_API_KEY"
  ) {}

  private getUrl(endpoint: string): string {
    // Get URL for requests
    let url = this.baseUrl;

    // Making sure URL is in the right format.
    if (url.endsWith("/")) {
      url = url.slice(0, -1);
    }

    if (endpoint.startsWith("/")) {
      endpoint = endpoint.slice(1);
    }

    return `${url}/${endpoint}`;
  }

  private async request<T>(
    method: AxiosRequestConfig["method"],
    endpoint: string,
    data?: unknown,
    params: Record<string, unknown> = {},
    headers?: AxiosRequestConfig["headers"]
  ): Promise<AxiosResponse<T>> {
    let requestPayload = data;
    const url = this.getUrl(endpoint);

    const requestHeaders = {
      "user-agent": `Transfa API SDK-Node/${this.version}`,
      accept: "application/json",
      Authorization: `${this.authHeaderPrefix} ${this.apiKey}`,
      ...headers,
    };

    if (requestPayload !== undefined && requestPayload !== null) {
      requestPayload = JSON.stringify(requestPayload);
      requestHeaders["content-type"] = "application/json;charset=utf-8";
    }

    const config: AxiosRequestConfig = {
      method,
      url,
      params,
      data: requestPayload,
      timeout: this.timeout,
      headers: requestHeaders,
      httpsAgent: this.verifySSL ? undefined : new (require("https").Agent)(),
    };

    try {
      const response = await axios(config);
      return response;
    } catch (error) {
      throw error;
    }
  }

  public async post<T>(
    endpoint: string,
    data?: any,
    headers?: AxiosRequestConfig["headers"]
  ): Promise<AxiosResponse<T>> {
    return this.request<T>("POST", endpoint, data, undefined, headers);
  }

  public async get<T>(
    endpoint: string,
    headers?: AxiosRequestConfig["headers"]
  ): Promise<AxiosResponse<T>> {
    return this.request<T>("GET", endpoint, undefined, undefined, headers);
  }
  public Payment: PaymentResource = new PaymentResource(this);
}
