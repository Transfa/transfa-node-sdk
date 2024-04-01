import { TransfaAPIClient } from "../apiClient";
import { PaymentTypeEnum } from "../types/enums";
import { convertToCamelCase } from "../utils/adapters";
import { v4 as uuidV4 } from "uuid";
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

  public async list(
    adaptedData = true
  ): Promise<PaginateDataType<RequestPaymentResponseType>> {
    const url = `${this.baseUrl}/`;
    const paymentList = await this.api.get<
      PaginateDataType<RequestPaymentResponseType>
    >(url);
    return paymentList.json();
  }

  public async retrieve(
    paymentId: string,
    adaptedData = true
  ): Promise<RequestPaymentResponseType> {
    const url = `${this.baseUrl}/${paymentId}/`;
    const payment = await this.api.get<RequestPaymentResponseType>(url);

    return payment.json();
  }

  public async refund(paymentId: string): Promise<RequestPaymentResponseType> {
    const url = `${this.baseUrl}/${paymentId}/refund/`;
    const refundData = await this.api.post(url);
    return convertToCamelCase(refundData.json());
  }

  public async status(
    paymentId: string
  ): Promise<{ status: string; financialStatus: string }> {
    try {
      const response = await this.retrieve(paymentId);

      const { status, financialStatus } = convertToCamelCase(response);
      return { status, financialStatus };
    } catch (error) {
      console.error(error);
      throw new Error("Error retrieving payment status");
    }
  }
}
