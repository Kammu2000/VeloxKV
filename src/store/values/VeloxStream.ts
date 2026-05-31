export interface StreamEntryId {
  timeStamp: number;
  sequence: number;
}

export type StreamEntry = Record<string, string>;

export interface StreamRecord {
  id: StreamEntryId;
  fields: StreamEntry;
}

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
}
