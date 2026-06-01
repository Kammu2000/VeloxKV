import { BlockedOperation } from "@blocking/BlockedOperation";
import { ClientSubscriptions } from "@pubsub/ClientSubscriptions";
import { CLIENT_CONNECTION_MODE } from "@client/constants";

export class ClientSession {
  private closed: boolean = false;
  private blockedOperation: BlockedOperation | undefined;
  public readonly subscriptions: ClientSubscriptions;
  private mode: CLIENT_CONNECTION_MODE = CLIENT_CONNECTION_MODE.NORMAL;

  constructor() {
    this.subscriptions = new ClientSubscriptions();
  }

  close(): void {
    if (this.closed) {
      return;
    }

    this.closed = true;
    this.blockedOperation?.cancel();
    this.subscriptions.dispose();
  }

  setBlockedOperation(operation: BlockedOperation | undefined): void {
    this.blockedOperation = operation;
  }

  isInNormalMode(): boolean {
    return this.mode === CLIENT_CONNECTION_MODE.NORMAL;
  }

  setClientMode(clientMode: CLIENT_CONNECTION_MODE): void {
    this.mode = clientMode;
  }

  isInSubscriptionMode(): boolean {
    return this.mode === CLIENT_CONNECTION_MODE.SUBSCRIPTION;
  }
}
