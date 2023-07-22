import * as cryptoJs from "crypto-js";
import { TransfaHeadersIdentifiers } from "../types/enums";

export default class Webhook {
  private webhookToken: string;
  private headers: Record<string, string>;
  private body: any;

  constructor(
    webhookToken: string,
    body: any,
    headers: Record<string, string>
  ) {
    if (!webhookToken) {
      throw new Error(
        "Can't work without a private secret for security reasons."
      );
    }

    if (!body) {
      throw new Error("Can't work without the body of the request.");
    }

    if (!headers) {
      throw new Error("Can't work without the headers.");
    }

    if (typeof body === "string") {
      try {
        this.body = JSON.parse(body);
      } catch (error) {
        throw new Error("Failed to parse the body JSON.");
      }
    } else {
      this.body = body;
    }

    this.webhookToken = webhookToken;
    this.headers = headers;
  }

  private signBody(body: string): string {
    const secret = cryptoJs.enc.Utf8.parse(this.webhookToken);
    const hash = cryptoJs.HmacSHA512(body, secret);

    return hash.toString(cryptoJs.enc.Hex);
  }

  public hasDataNotTempered(transfaApiSignature: string): boolean {
    const bodyString = JSON.stringify(this.body);
    const signature = this.signBody(bodyString);

    return signature === transfaApiSignature;
  }

  public verify(): any {
    const signature = this.headers[TransfaHeadersIdentifiers.WebhookSignature];

    if (!signature) {
      throw new Error("No signature provided. Contact technical support.");
    }

    if (this.hasDataNotTempered(signature)) {
      return this.body;
    }

    return null;
  }
}
