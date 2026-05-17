import { Deque } from "../../common/utils/Deque";
import { FastQueue } from "../../common/utils/FastQueue";

export class VeloxList<T, W> {
  private list = new Deque<T>();
  private waiters = new FastQueue<W>();

  at(idx: number): T | undefined {
    return this.list.at(idx);
  }

  lpush(val: T): void {
    this.list.push_front(val);
  }

  rpush(val: T): void {
    this.list.push_back(val);
  }

  lpop(): T {
    return this.list.pop_front();
  }

  rpop(): T | undefined {
    return this.list.pop_back();
  }

  lrange(startIdx: number, lastIdx: number): T[] {
    const start = this.list.adaptIndex(Number(startIdx));
    const end = this.list.adaptIndex(Number(lastIdx));

    if (start > end) {
      return [];
    }

    const result: T[] = [];

    for (let i = start; i <= end; i++) {
      const val = this.list.at(i);

      if (val !== undefined) {
        result.push(val);
      }
    }

    return result;
  }

  size(): number {
    return this.list.size();
  }

  isEmpty(): boolean {
    return this.list.size() === 0;
  }

  getNextWaiter(): W | undefined {
    return this.waiters.pop();
  }

  removeWaiter(token: W): void {
    this.waiters.delete(token);
  }

  getWaiters(): FastQueue<W> {
    return this.waiters;
  }
}
