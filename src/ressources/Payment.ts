import { AxiosRequestConfig, AxiosResponse } from "axios";
import { TransfaAPIClient } from "../apiClient";
import { PaymentTypeEnum } from "../types/enums";
import { convertToCamelCase } from "../utils/adapters";
import { uuid } from "uuidv4";
import {
  PaginateDataType,
  RequestPaymentPayloadType,
  RequestPaymentResponseType,
} from "types";

export default class PaymentResource {
  private api: TransfaAPIClient;
  private baseUrl: string;

  constructor(api: TransfaAPIClient) {
    this.api = api;
    this.baseUrl = "api/v1/optimus/payment";
  }

  public requestPayment(
    data: RequestPaymentPayloadType,
    idempotencyKey?: string
  ): Promise<AxiosResponse<any>> {
    const url = `${this.baseUrl}/`;

    const headers: AxiosRequestConfig["headers"] = {};
    if (idempotencyKey) {
      headers["Idempotency-Key"] = idempotencyKey;
    } else {
      headers["Idempotency-Key"] = uuid();
    }

    data.type = PaymentTypeEnum.RequestPayment;

    return this.api.post(url, data, headers);
  }

  public async list(
    adaptedData = true
  ): Promise<AxiosResponse<PaginateDataType<RequestPaymentResponseType>>> {
    const url = `${this.baseUrl}/`;
    const paymentList = await this.api.get<
      PaginateDataType<RequestPaymentResponseType>
    >(url);
    if (adaptedData) {
      paymentList.data.results.map((payment) => convertToCamelCase(payment));
    }
    return paymentList;
  }

  public async retrieve(
    paymentId: string,
    adaptedData = true
  ): Promise<AxiosResponse<RequestPaymentResponseType>> {
    const url = `${this.baseUrl}/${paymentId}/`;
    const payment = await this.api.get<RequestPaymentResponseType>(url);
    if (adaptedData) {
      return convertToCamelCase(payment);
    }
    return payment;
  }

  public refund(
    paymentId: string
  ): Promise<AxiosResponse<RequestPaymentResponseType>> {
    const url = `${this.baseUrl}/${paymentId}/refund/`;
    return convertToCamelCase(this.api.post(url));
  }

  public async status(
    paymentId: string
  ): Promise<{ status: string; financialStatus: string }> {
    try {
      const response = await this.retrieve(paymentId);
      if (response.status !== 200) {
        console.error(response.data);
        throw new Error("Error retrieving payment status");
      }
      const { status, financialStatus } = convertToCamelCase(response.data);
      return { status, financialStatus };
    } catch (error) {
      console.error(error);
      throw new Error("Error retrieving payment status");
    }
  }
}
