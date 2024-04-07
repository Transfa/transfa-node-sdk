import { PaymentMode, PaymentStatusEnum, PaymentTypeEnum } from "./enums";

export type RequestPaymentPayloadType = {
  account_alias: string;
  amount: number;
  mode: PaymentMode;
  type: PaymentTypeEnum;
  webhook_url?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
};

export type RequestPaymentResponseType = {
  id: string;
  account_alias: string;
  first_name: string;
  last_name: string;
  email: string;
  type: PaymentTypeEnum;
  amount: string;
  reference: string;
  processing_number: string;
  mode: PaymentMode;
  status: PaymentStatusEnum;
  financial_status: PaymentStatusEnum;
  completed: string;
  processing: string;
  failed: string;
  created: string;
  updated: string;
  webhook_url: PaymentStatusEnum;
  refunded: PaymentStatusEnum;
  test: boolean;
  paid_organization: boolean;
};

export type PaginateDataType<T> = {
  count: number;
  previous: string;
  next: string;
  results: T[];
};

export type Method =
  | "get"
  | "GET"
  | "delete"
  | "DELETE"
  | "options"
  | "OPTIONS"
  | "post"
  | "POST"
  | "put"
  | "PUT"
  | "patch"
  | "PATCH";
