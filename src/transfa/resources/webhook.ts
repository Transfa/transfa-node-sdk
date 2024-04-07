import { enc, HmacSHA512 } from "crypto-js";
import { TransfaHeadersIdentifiers } from "transfa/types/enums";

export default class WebhookResource {
  private webhookToken: string;

  constructor(webhookToken: string) {
    if (!webhookToken) {
      throw new Error(
        "Can't work without a private secret for security reasons."
      );
    }
    this.webhookToken = webhookToken;
  }

  private validatePayload(body: unknown, headers: Record<string, string>) {
    if (!body) {
      throw new Error("Can't work without the body of the request.");
    }

    if (!headers) {
      throw new Error("Can't work without the headers.");
    }

    if (typeof body === "string") {
      try {
        JSON.parse(body);
      } catch (error) {
        throw new Error("Failed to parse the body JSON.");
      }
    }
  }

  private signBody(body: string, secretToken: string): string {
    const secret = enc.Utf8.parse(secretToken);
    const hash = HmacSHA512(body, secret);
    return hash.toString(enc.Hex);
  }

  public hasDataNotTempered(
    transfaApiSignature: string,
    body: unknown
  ): boolean {
    const bodyString = JSON.stringify(body);
    const signature = this.signBody(bodyString, this.webhookToken);

    return signature === transfaApiSignature;
  }

  public verify(body: unknown, headers: Record<string, string>): any {
    this.validatePayload(body, headers);

    const signature = headers[TransfaHeadersIdentifiers.WebhookSignature];

    if (!signature) {
      throw new Error("No signature provided. Contact technical support.");
    }

    if (!this.hasDataNotTempered(signature, body)) {
      return null;
    }
    return body;
  }
}
