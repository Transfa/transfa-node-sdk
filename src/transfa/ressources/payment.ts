import { v4 as uuidV4 } from "uuid";

import { TransfaAPIClient } from "apiClient";
import { API_ROUTES } from "transfa/configs/api_routes";
import {
  PaginateDataType,
  RequestPaymentPayloadType,
  RequestPaymentResponseType,
} from "transfa/types/types";
import { PaymentTypeEnum } from "transfa/types/enums";

export default class PaymentResource {
  private api: TransfaAPIClient;
  private baseUrl: string;

  constructor(api: TransfaAPIClient) {
    this.api = api;
    this.baseUrl = API_ROUTES.payment_endpoint;
  }

  public requestPayment(
    data: RequestPaymentPayloadType,
    idempotencyKey?: string
  ): Promise<Response> {
    const url = `${this.baseUrl}/`;
    const payload = { ...data };

    const headers: HeadersInit = {};
    if (idempotencyKey) {
      headers["Idempotency-Key"] = idempotencyKey;
    } else {
      headers["Idempotency-Key"] = uuidV4();
    }

    payload.type = PaymentTypeEnum.RequestPayment;

    return this.api.post(url, payload, headers);
  }

  public async list(): Promise<PaginateDataType<RequestPaymentResponseType>> {
    const url = `${this.baseUrl}/`;
    const paymentList = await this.api.get<
      PaginateDataType<RequestPaymentResponseType>
    >(url);
    return paymentList.json();
  }

  public async retrieve(
    paymentId: string
  ): Promise<RequestPaymentResponseType> {
    const url = `${this.baseUrl}/${paymentId}/`;
    const payment = await this.api.get<RequestPaymentResponseType>(url);

    return payment.json();
  }

  public async refund(paymentId: string): Promise<RequestPaymentResponseType> {
    const url = `${this.baseUrl}/${paymentId}/refund/`;
    const refundData = await this.api.post(url);
    return refundData.json();
  }

  public async status(
    paymentId: string
  ): Promise<{ status: string; financial_status: string }> {
    try {
      const response = await this.retrieve(paymentId);

      const { status, financial_status } = response;
      return { status, financial_status };
    } catch (error) {
      console.error(error);
      throw new Error("Error retrieving payment status");
    }
  }
}
