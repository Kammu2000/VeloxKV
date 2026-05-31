export interface StreamEntryId {
  timeStamp: number;
  sequence: number;
}

export type StreamEntry = Record<string, string>;

export interface StreamRecord {
  id: StreamEntryId;
  fields: StreamEntry;
}

const compareIds = (a: StreamEntryId, b: StreamEntryId): number => {
  if (a.timeStamp === b.timeStamp) {
    return a.sequence - b.sequence;
  }

  return a.timeStamp - b.timeStamp;
};

const upperBound = (entries: StreamRecord[], target: StreamEntryId): number => {
  let low = 0,
    high = entries.length - 1;
  let streamIdx = entries.length;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);

    if (compareIds(entries[mid].id, target) > 0) {
      streamIdx = mid;
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }

  return streamIdx;
};

const lowerBound = (entries: StreamRecord[], target: StreamEntryId): number => {
  let low = 0,
    high = entries.length - 1;
  let streamIdx = entries.length;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);

    if (compareIds(entries[mid].id, target) >= 0) {
      streamIdx = mid;
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }

  return streamIdx;
};

export class VeloxStream {
  private entries: StreamRecord[] = [];

  addEntry(id: StreamEntryId, fields: StreamEntry): void {
    this.entries.push({ id, fields });
  }

  getTopId(): StreamEntryId {
    if (this.entries.length === 0) {
      return { timeStamp: 0, sequence: 0 };
    }

    return this.entries[this.entries.length - 1].id;
  }

  range(a: StreamEntryId, b: StreamEntryId): StreamRecord[] {
    const left = lowerBound(this.entries, a);
    const right = upperBound(this.entries, b);

    return this.entries.slice(left, right);
  }
}
