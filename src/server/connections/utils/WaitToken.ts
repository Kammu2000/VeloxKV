import { BlockedOperation } from "./BlockedOperation";
import { FastQueue } from "@common/utils/FastQueue";

export class WaitToken {
  private disposed: boolean = false;

  constructor(
    private readonly queue: FastQueue<WaitToken>,
    readonly operation: BlockedOperation,
  ) {}

  dispose(): void {
    if (this.disposed) return;

    this.queue.delete(this);
    this.disposed = true;
  }
}
