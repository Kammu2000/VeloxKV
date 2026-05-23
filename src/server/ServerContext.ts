import { VeloxStore } from "@store/VeloxStore";
import { BlockingManager } from "@blocking/BlockingManager";
import { PubSubManager } from "@pubsub/PubSubManager";

interface ServerContextOptions {
  store: VeloxStore;
  blockingManager: BlockingManager;
  pubsubManager: PubSubManager;
}

export class ServerContext {
  public readonly store: VeloxStore;
  public readonly blockingManager: BlockingManager;
  public readonly pubsubManager: PubSubManager;

  constructor(options: ServerContextOptions) {
    this.store = options.store;
    this.blockingManager = options.blockingManager;
    this.pubsubManager = options.pubsubManager;
  }
}
