import { RespArray } from "@protocol/types";
import { StreamEntryId, StreamRecord } from "../VeloxStream";
import { createRespArray, createRespBulkString } from "@protocol/utils";

export const serializeStreamEntryId = (id: StreamEntryId): string => {
  return `${id.timeStamp}-${id.sequence}`;
};

export const deserializeStreamEntryId = (rawId: string): StreamEntryId => {
  const hyphenIdx = rawId.indexOf("-");
  if (hyphenIdx === -1) throw new Error("Invalid stream entry id");

  const timeStamp = parseInt(rawId.slice(0, hyphenIdx), 10);
  const sequence = parseInt(rawId.slice(hyphenIdx + 1), 10);

  return { timeStamp, sequence };
};

export const generateStreamEntryId = (
  rawId: string,
  topId: StreamEntryId,
): StreamEntryId => {
  const now = Date.now();

  if (rawId === "*") {
    const sequence = topId.timeStamp === now ? topId.sequence + 1 : 0;
    return { timeStamp: now, sequence };
  }

  const hyphenIdx = rawId.indexOf("-");

  if (hyphenIdx === -1) {
    throw new Error(`Invalid stream id: ${rawId}`);
  }

  const tsPart = rawId.slice(0, hyphenIdx);
  const seqPart = rawId.slice(hyphenIdx + 1);

  const ts = tsPart === "*" ? now : parseInt(tsPart, 10);
  const isSeqWild = seqPart === "*";

  if (ts < topId.timeStamp) {
    throw new Error(
      "The ID specified in XADD is equal or smaller than the target stream top item",
    );
  }

  if (isSeqWild) {
    const sequence = topId.timeStamp === ts ? topId.sequence + 1 : 0;

    return {
      timeStamp: ts,
      sequence,
    };
  }

  const seq = parseInt(seqPart, 10);

  if (ts === topId.timeStamp && seq <= topId.sequence) {
    throw new Error(
      "The ID specified in XADD is equal or smaller than the target stream top item",
    );
  }

  if (ts === 0 && seq === 0) {
    throw new Error("The ID specified in XADD must be greater than 0-0");
  }

  return { timeStamp: ts, sequence: seq };
};

export const serializeStreamEntries = (entries: StreamRecord[]): RespArray => {
  return createRespArray(
    entries.map((entry: StreamRecord) => {
      const serializedId = serializeStreamEntryId(entry.id);
      const serializedFields = Object.entries(entry.fields).flatMap(
        ([k, v]: [string, string]) => [
          createRespBulkString(k),
          createRespBulkString(v),
        ],
      );

      return createRespArray([
        createRespBulkString(serializedId),
        createRespArray(serializedFields),
      ]);
    }),
  );
};
