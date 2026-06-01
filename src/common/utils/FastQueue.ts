class Node<T> {
  constructor(
    public value: T,
    public next: Node<T> | null = null,
    public prev: Node<T> | null = null,
  ) {}
}

export class FastQueue<T> {
  private head: Node<T> | null = null;
  private tail: Node<T> | null = null;
  private map = new Map<T, Node<T>>();

  push(value: T): void {
    const node = new Node(value);
    this.map.set(value, node);

    if (!this.tail) {
      this.tail = node;
      this.head = node;
      return;
    }

    const currentTail = this.tail;
    currentTail.next = node;
    node.prev = currentTail;
    this.tail = node;
  }

  pop(): T | undefined {
    if (!this.head) return undefined;

    const value = this.head.value;
    this.delete(value);
    return value;
  }

  delete(value: T): void {
    const node = this.map.get(value);

    if (!node) return;

    this.map.delete(value);

    const prevNode = node.prev;
    const nextNode = node.next;

    if (prevNode) {
      prevNode.next = nextNode;
    } else this.head = nextNode; // removing head

    if (nextNode) {
      nextNode.prev = prevNode;
    } else this.tail = prevNode; // removing tail
  }

  isEmpty(): boolean {
    return this.head === null;
  }

  clear(): void {
    this.head = null;
    this.tail = null;
  }
}
