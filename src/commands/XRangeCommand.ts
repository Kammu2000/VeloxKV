import { VeloxDataType } from "@store/types";
import { Command, CommandContext } from "./runtime/Command";
import { RespValue } from "@protocol/types";
import { createRespError } from "@protocol/utils";
import {
  deserializeStreamEntryId,
  serializeStreamEntries,
} from "@store/values/utils/streamUtils";

export class XRangeCommand implements Command {
  async execute(ctx: CommandContext): Promise<RespValue> {
    const { args, server } = ctx;
    const [key, startId, endId] = args;

    const storedValue = server.store.get(key);

    if (!storedValue || storedValue.type !== VeloxDataType.STREAM) {
      return createRespError("Key does not point to a velox stream");
    }

    const stream = storedValue.value;

    const adaptedStartId =
      startId === "-"
        ? { timeStamp: 0, sequence: 0 }
        : deserializeStreamEntryId(startId);
    const adaptedEndId =
      endId === "+"
        ? {
            timeStamp: Number.MAX_SAFE_INTEGER,
            sequence: Number.MAX_SAFE_INTEGER,
          }
        : deserializeStreamEntryId(endId);

    const entries = stream.range(adaptedStartId, adaptedEndId);
    return serializeStreamEntries(entries);
  }
}
