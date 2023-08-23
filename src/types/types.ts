import { PaymentMode, PaymentStatusEnum, PaymentTypeEnum } from "enums";

export type RequestPaymentPayloadType = {
  accountAlias: string;
  amount: number;
  mode: PaymentMode;
  type: PaymentTypeEnum;
  webhookUrl?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
};

export type RequestPaymentResponseType = {
  id: string;
  accountAlias: string;
  firstName: string;
  lastName: string;
  email: string;
  type: PaymentTypeEnum;
  amount: string;
  reference: string;
  processingNumber: string;
  mode: PaymentMode;
  status: PaymentStatusEnum;
  financialStatus: PaymentStatusEnum;
  completed: string;
  processing: string;
  failed: string;
  created: string;
  updated: string;
  webhookUrl: PaymentStatusEnum;
  refunded: PaymentStatusEnum;
  test: boolean;
  paidOrganization: boolean;
};

export type PaginateDataType<T> = {
  count: number;
  previous: string;
  next: string;
  results: T[];
};
