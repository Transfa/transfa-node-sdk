import { AxiosRequestConfig, AxiosResponse } from "axios";
import TransfaAPIClient from "../apiClient";
import { PaymentTypeEnum } from "../types/enums";
import { uuid } from "uuidv4";

export default class PaymentResource {
  private api: TransfaAPIClient;
  private baseUrl: string;

  constructor(api: TransfaAPIClient) {
    this.api = api;
    this.baseUrl = "api/v1/optimus/payment";
  }

  public requestPayment(
    data: {
      account_alias: string;
      amount: number;
      mode: string;
      webhook_url?: string;
      first_name?: string;
      last_name?: string;
      email?: string;
      type: PaymentTypeEnum;
    },
    idempotency_key?: string
  ): Promise<AxiosResponse<any>> {
    const url = `${this.baseUrl}/`;

    const headers: AxiosRequestConfig["headers"] = {};
    if (idempotency_key) {
      headers["Idempotency-Key"] = idempotency_key;
    } else {
      headers["Idempotency-Key"] = uuid();
    }

    data.type = PaymentTypeEnum.RequestPayment;

    return this.api.post(url, data, headers);
  }

  public list(): Promise<AxiosResponse<any>> {
    const url = `${this.baseUrl}/`;
    return this.api.get(url);
  }

  public retrieve(payment_id: string): Promise<AxiosResponse<any>> {
    const url = `${this.baseUrl}/${payment_id}/`;
    return this.api.get(url);
  }

  public refund(payment_id: string): Promise<AxiosResponse<any>> {
    const url = `${this.baseUrl}/${payment_id}/refund/`;
    return this.api.post(url);
  }

  public async status(
    payment_id: string
  ): Promise<{ status: string; financial_status: string }> {
    try {
      const response = await this.retrieve(payment_id);
      if (response.status !== 200) {
        console.error(response.data);
        throw new Error("Error retrieving payment status");
      }

      const { status, financial_status } = response.data;
      return { status, financial_status };
    } catch (error) {
      console.error(error);
      throw new Error("Error retrieving payment status");
    }
  }
}
