import { Method } from "types";
import PaymentResource from "./ressources/payment";

export const apiBase = "https://api.transfapp.com";
export const defaultAuthHeaderBearer = "Api-Transfa-Key";

export class TransfaAPIClient {
  private baseUrl: string = apiBase;
  private authHeaderPrefix: string = defaultAuthHeaderBearer;
  private version: string = "1.0.0";
  constructor(
    private apiKey: string = "YOUR_API_KEY",
    private webhookToken: string
  ) {}

  private getUrl(endpoint: string, params?: Record<string, string>): string {
    const baseUrl = this.baseUrl.endsWith("/")
      ? this.baseUrl
      : this.baseUrl + "/";

    const normalizedEndpoint = endpoint.startsWith("/")
      ? endpoint.slice(1)
      : endpoint;

    const queryString = new URLSearchParams(params).toString();

    return `${baseUrl}${normalizedEndpoint}${
      queryString ? `?${queryString}` : ""
    }`;
  }

  private async request<T>(
    method: Method,
    endpoint: string,
    data?: BodyInit,
    params?: Record<string, string>,
    headers?: HeadersInit
  ): Promise<Response> {
    let requestPayload = data;
    const url = this.getUrl(endpoint, params);

    const configHeaders: HeadersInit = {
      "user-agent": `Transfa API SDK-Node/${this.version}`,
      accept: "application/json",
      Authorization: `Bearer ${this.authHeaderPrefix} ${this.apiKey}`,
      ...headers,
    };
    const requestHeaders = new Headers(configHeaders);

    if (requestPayload !== undefined && requestPayload !== null) {
      requestPayload = JSON.stringify(requestPayload);
      requestHeaders.append("content-type", "application/json;charset=utf-8");
    }
    const options: RequestInit = {
      headers: requestHeaders,
      body: requestPayload,
      method,
    };

    try {
      const response = await fetch(url, options);
      return response;
    } catch (error) {
      throw error;
    }
  }

  public async post<T>(
    endpoint: string,
    data?: any,
    headers?: HeadersInit
  ): Promise<Response> {
    return this.request<T>("POST", endpoint, data, undefined, headers);
  }

  public async get<T>(
    endpoint: string,
    headers?: HeadersInit
  ): Promise<Response> {
    return this.request<T>("GET", endpoint, undefined, undefined, headers);
  }

  public Payment: PaymentResource = new PaymentResource(this);
}
