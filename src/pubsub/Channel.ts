import { SubscriptionToken } from "./SubscriptionToken";
import { ClientRespWriter } from "@client/ClientRespWriter";

export class Channel {
  public readonly name: string;
  private subscriptions = new Set<SubscriptionToken>();

  constructor(name: string) {
    this.name = name;
  }

  addSubscriber(respWriter: ClientRespWriter): SubscriptionToken {
    const token = new SubscriptionToken(this, respWriter);
    this.subscriptions.add(token);
    return token;
  }

  publish(message: string): number {
    for (const token of this.subscriptions) {
      token.notify(message);
    }

    return this.size();
  }

  removeSubscriber(token: SubscriptionToken): void {
    this.subscriptions.delete(token);
  }

  size(): number {
    return this.subscriptions.size;
  }
}
