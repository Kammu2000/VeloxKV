import { VeloxDataType } from "@store/types";
import { Command, CommandContext } from "./runtime/Command";
import { RespValue } from "@protocol/types";
import { StreamEntry, VeloxStream } from "@store/values/VeloxStream";
import {
  generateStreamEntryId,
  serializeStreamEntryId,
} from "@store/values/utils/streamUtils";
import { createRespBulkString } from "@protocol/utils";

export class XAddCommand implements Command {
  async execute(ctx: CommandContext): Promise<RespValue> {
    const { args, server } = ctx;
    const [key, id, ...fieldValuePairs] = args;

    if (fieldValuePairs.length === 0 || fieldValuePairs.length & 1) {
      throw new Error("wrong number arguments for XADD command");
    }

    let streamObj = server.store.get(key);

    if (!streamObj) {
      streamObj = { type: VeloxDataType.STREAM, value: new VeloxStream() };
      server.store.set(key, streamObj);
    }

    const stream = streamObj.value;

    const fields: StreamEntry = {};

    for (let i = 0; i < fieldValuePairs.length; i += 2) {
      fields[fieldValuePairs[i]] = fieldValuePairs[i + 1];
    }

    const topId = (stream as VeloxStream).getTopId();
    const entryId = generateStreamEntryId(id, topId);
    (stream as VeloxStream).addEntry(entryId, fields);

    return createRespBulkString(serializeStreamEntryId(entryId));
  }
}
