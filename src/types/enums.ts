export enum PaymentStatusEnum {
  Completed = "completed",
  Processing = "processing",
  Pending = "pending",
  Failed = "failed",
}

export enum PaymentMode {
  MtnBenin = "mtn-benin",
}

export enum PaymentTypeEnum {
  RequestPayment = "request-payment",
}

export enum PaymentEventHookEnum {
  Processing = "payment:processing",
  Failed = "payment:failed",
  Success = "payment:success",
}

export enum APIKeyPrefix {
  Test = "ak_test",
  Live = "ak_live",
}

export enum PrivateSecretPrefix {
  Test = "ps_test",
  Live = "ps_live",
}

export enum TransfaHeadersIdentifiers {
  WebhookSignature = "X-Webhook-Transfa-Signature",
}
