import PaymentResource from "transfa/resources/payment";
import WebhookRessource from "transfa/resources/webhook";

import { PACKAGE_VERSION } from "transfa/configs/version";

import { TRANSFAPP_BASE_API_URL } from "transfa/configs/apiRoutes";

import { Method } from "transfa/types/types";
import { TRANSFAPP_PACKAGE_USER_AGENT } from "transfa/constants";

export class TransfaAPIClient {
  private baseUrl: string = TRANSFAPP_BASE_API_URL;
  private version: string = PACKAGE_VERSION;
  constructor(private apiKey: string, private webhookToken?: string) {}

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
      "user-agent": `${TRANSFAPP_PACKAGE_USER_AGENT}/${this.version}`,
      accept: "application/json",
      Authorization: this.apiKey,
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
  public Webhook: WebhookRessource = new WebhookRessource(this.webhookToken);
}
