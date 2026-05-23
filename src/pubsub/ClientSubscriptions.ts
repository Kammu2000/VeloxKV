import { SubscriptionToken } from "./SubscriptionToken";

export class ClientSubscriptions {
  private subscriptions = new Map<string, SubscriptionToken>();

  add(channelName: string, token: SubscriptionToken): void {
    this.subscriptions.set(channelName, token);
  }

  has(channelName: string): boolean {
    return this.subscriptions.has(channelName);
  }

  get(channelName: string): SubscriptionToken | undefined {
    return this.subscriptions.get(channelName);
  }

  remove(channelName: string): void {
    this.subscriptions.delete(channelName);
  }

  dispose(): void {
    for (const token of this.subscriptions.values()) {
      token.dispose();
    }

    this.subscriptions.clear();
  }

  totalSubscription(): number {
    return this.subscriptions.size;
  }
}
