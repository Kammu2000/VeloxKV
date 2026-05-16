export class Deque<T> {
  private list: Record<string, T>;
  private head: number;
  private tail: number;

  constructor() {
    this.list = Object.create(null);

    // keeping [head, tail) kind of design inspired from c++ and many other systems
    this.head = 0; // first valid index
    this.tail = 0; // next index to last valid index in list
  }

  push_back(val: T): void {
    this.list[this.tail++] = val;
  }

  push_front(val: T): void {
    this.list[--this.head] = val;
  }

  pop_back(): T | undefined {
    if (this.isEmpty()) return undefined;

    const lastId = this.tail - 1;
    const val = this.list[lastId];
    delete this.list[lastId];

    this.tail = lastId;
    return val;
  }

  pop_front(): T | undefined {
    if (this.isEmpty()) return undefined;

    const val = this.list[this.head];
    delete this.list[this.head];

    this.head++;
    return val;
  }

  size(): number {
    return this.tail - this.head;
  }

  isEmpty(): boolean {
    return this.size() === 0;
  }

  adaptIndex(idx: number): number {
    const len = this.size();

    if (idx < 0) {
      idx += len;
    }
    return idx;
  }

  at(idx: number): T | undefined {
    if (this.isEmpty()) return undefined;
    idx = this.adaptIndex(idx);

    const len = this.size();
    if (idx < 0 && idx >= len) return undefined;

    return this.list[this.head + idx];
  }
}
