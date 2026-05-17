import { WaitToken } from "./WaitToken";
import { createRespNull } from "../../../protocol/utils";
import { RespValue } from "../../../protocol/types";

export class BlockedOperation {
  readonly promise: Promise<RespValue>;
  private completed: boolean = false;
  private resolveFn!: (value: RespValue) => void;

  private readonly tokens: WaitToken[] = [];
  private readonly timeout?: NodeJS.Timeout;

  constructor(timeOutMs: number | undefined) {
    this.promise = new Promise((resolve): void => {
      this.resolveFn = resolve;
    });

    if (timeOutMs && timeOutMs !== 0) {
      this.timeout = setTimeout((): void => {
        this.complete(createRespNull());
      });
    }
  }

  addToken(token: WaitToken): void {
    this.tokens.push(token);
  }

  complete(value: RespValue): void {
    if (this.completed) return;

    this.cleanup();
    this.resolveFn(value);
  }

  cancel(): void {
    if (this.completed) return;

    this.cleanup();
  }

  cleanup(): void {
    this.completed = true;

    for (const token of this.tokens) {
      token.dispose();
    }

    clearTimeout(this.timeout);
  }
}
