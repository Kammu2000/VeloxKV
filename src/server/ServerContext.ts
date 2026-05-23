import { VeloxStore } from "@store/VeloxStore";
import { BlockingManager } from "@blocking/BlockingManager";

interface ServerContextOptions {
  store: VeloxStore;
  blockingManager: BlockingManager;
}

export class ServerContext {
  public readonly store: VeloxStore;
  public readonly blockingManager: BlockingManager;

  constructor(options: ServerContextOptions) {
    this.store = options.store;
    this.blockingManager = options.blockingManager;
  }
}
