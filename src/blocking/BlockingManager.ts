import { WaitToken } from "./WaitToken";
import { FastQueue } from "@common/utils/FastQueue";

export class BlockingManager {
  private waitingQueues = new Map<string, FastQueue<WaitToken>>();

  createWaitingQueue(key: string): FastQueue<WaitToken> {
    const queue = new FastQueue<WaitToken>();
    this.waitingQueues.set(key, queue);
    return queue;
  }

  removeWaitingQueue(key: string): void {
    if (this.waitingQueues.has(key)) {
      this.waitingQueues.delete(key);
    }
  }

  getWaitingQueue(key: string): FastQueue<WaitToken> | undefined {
    return this.waitingQueues.get(key);
  }
}
