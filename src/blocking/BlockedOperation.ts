import { RespValue } from "@protocol/types";
import { WaitContext } from "./types";

export enum BLOCKED_OPERATION_STATE {
  ACTIVE = "ACTIVE",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
}

export class BlockedOperation {
  readonly promise: Promise<RespValue>;
  private resolveFn!: (value: RespValue) => void;
  private readonly timeout: NodeJS.Timeout | undefined;
  private readonly waitContext: WaitContext;
  private state: BLOCKED_OPERATION_STATE = BLOCKED_OPERATION_STATE.ACTIVE;

  constructor(
    waitContext: WaitContext,
    timeOutMs: number | undefined,
    timeoutValue: RespValue,
  ) {
    this.waitContext = waitContext;

    this.promise = new Promise((resolve): void => {
      this.resolveFn = resolve;
    });

    this.timeout = this.scheduleTimeout(timeOutMs, timeoutValue);
  }

  private scheduleTimeout(
    timeOutMs: number | undefined,
    timeoutValue: RespValue,
  ): NodeJS.Timeout | undefined {
    if (!timeOutMs || timeOutMs === 0) {
      return undefined;
    }

    return setTimeout(() => {
      this.complete(timeoutValue);
    }, timeOutMs);
  }

  complete(value: RespValue): void {
    if (this.state !== BLOCKED_OPERATION_STATE.ACTIVE) return;

    this.state = BLOCKED_OPERATION_STATE.COMPLETED;
    this.cleanup();
    this.resolveFn(value);
  }

  cancel(): void {
    if (this.state !== BLOCKED_OPERATION_STATE.ACTIVE) return;

    this.state = BLOCKED_OPERATION_STATE.CANCELLED;
    this.cleanup();
  }

  private cleanup(): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  getWaitContext(): WaitContext {
    return this.waitContext;
  }
}
