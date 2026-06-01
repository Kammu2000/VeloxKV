import { createRespError, createRespNull } from "@protocol/utils";
import { Command, CommandContext } from "./runtime/Command";
import { StreamEntryId, StreamRecord } from "@store/values/VeloxStream";
import {
  deserializeStreamEntryId,
  createXReadRespResponse,
} from "@store/values/utils/streamUtils";
import { BlockedOperation } from "@blocking/BlockedOperation";
import { VeloxDataType } from "@store/types";
import { RespValue } from "@protocol/types";

export class XReadCommand implements Command {
  async execute(ctx: CommandContext): Promise<RespValue> {
    const { args, server, client } = ctx;
    let timeoutMs: number | undefined;
    let idx = 0;

    if (args[idx].toUpperCase() === "BLOCK") {
      idx++;
      timeoutMs = parseInt(args[idx++], 10);
    }

    if (args[idx].toUpperCase() != "STREAMS") {
      return createRespError(`Unsupported arguement: ${args[idx]}`);
    }

    idx++;

    const remainingArgs = args.length - idx;

    if (remainingArgs % 2 != 0) {
      return createRespError("Every stream should be paired with an entry id");
    }

    const remainingPairCnt = remainingArgs / 2;
    const streamKeys = args.slice(idx, idx + remainingPairCnt);
    const rawIds = args.slice(idx + remainingPairCnt);

    const baseIds = rawIds.map((id: string, i: number): StreamEntryId => {
      if (id === "$") {
        const storedValue = server.store.get(streamKeys[i]);

        if (storedValue?.type !== VeloxDataType.STREAM) {
          return { timeStamp: 0, sequence: 0 };
        }

        const stream = storedValue.value;
        return stream.getTopId();
      }

      return deserializeStreamEntryId(id);
    });

    const streamVsEntries = this.collectEntries(streamKeys, baseIds, server);

    if (Object.keys(streamVsEntries).length > 0) {
      return createXReadRespResponse(streamVsEntries);
    }

    if (timeoutMs === undefined) {
      return createRespNull();
    }

    // XREAD is blocking if we reach here
    const streams: Record<string, StreamEntryId> = {};

    for (let i = 0; i < streamKeys.length; i++) {
      const key = streamKeys[i];
      streams[key] = baseIds[i];
    }

    const blockedOp = new BlockedOperation(
      { type: VeloxDataType.STREAM, streams },
      timeoutMs,
      createRespNull(),
    );

    for (const key of streamKeys) {
      server.blockingManager.addOperation(blockedOp, key, VeloxDataType.STREAM);
    }

    client.session.setBlockedOperation(blockedOp);

    const result = await blockedOp.promise;
    client.session.setBlockedOperation(undefined);
    return result;
  }

  private collectEntries(
    streamKeys: string[],
    baseIds: StreamEntryId[],
    server: CommandContext["server"],
  ): Record<string, StreamRecord[]> {
    const result: Record<string, StreamRecord[]> = {};

    streamKeys.forEach((key: string, i: number): void => {
      const storedValue = server.store.get(key);

      if (storedValue?.type === VeloxDataType.STREAM) {
        const stream = storedValue.value;
        const entries = stream.after(baseIds[i]);

        if (entries.length > 0) {
          result[key] = entries;
        }
      }
    });

    return result;
  }
}
