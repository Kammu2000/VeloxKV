import { WaitToken } from "./WaitToken";
import { FastQueue } from "@common/utils/FastQueue";

export class BlockingManager {
  private waitingQueues = new Map<string, FastQueue<WaitToken>>();

  creatingWaitingQueue(key: string): FastQueue<WaitToken> {
    const queue = new FastQueue<WaitToken>();
    this.waitingQueues.set(key, queue);
    return queue;
  }

  getWaitingQueue(key: string): FastQueue<WaitToken> | undefined {
    return this.waitingQueues.get(key);
  }
}
