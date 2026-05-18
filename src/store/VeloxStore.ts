import { FastQueue } from "../common/utils/FastQueue";
import { WaitToken } from "../server/connections/utils/WaitToken";
import { VeloxValue } from "./types";

export class VeloxStore {
  private store = new Map<string, VeloxValue>();
  public listWaitingMap = new Map<string, FastQueue<WaitToken>>();

  get(key: string): VeloxValue | null {
    const val = this.store.get(key);
    return val ? val : null;
  }

  set(key: string, value: VeloxValue): void {
    this.store.set(key, value);
  }

  has(key: string): boolean {
    return this.store.has(key);
  }

  del(key: string): void {
    if (this.store.has(key)) {
      this.store.delete(key);
    }
  }

  clear(): void {
    this.store.clear();
  }
}
