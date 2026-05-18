import {
  createRespArray,
  createRespBulkString,
  createRespError,
} from "@protocol/utils";
import { Command, CommandContext } from "./runtime/Command";
import { VeloxDataType } from "@store/types";
import { RespBulkString, RespValue } from "@protocol/types";

export class LRangeCommand implements Command {
  async execute(ctx: CommandContext): Promise<RespValue> {
    const { args, store } = ctx;
    const [listKey, startIdx, lastIdx] = args;

    const listObj = store.get(listKey);

    if (!listObj || !startIdx || !lastIdx) {
      return createRespArray([]);
    }

    if (listObj.type !== VeloxDataType.LIST) {
      return createRespError(
        "Operation against a key holding the wrong kind of value",
      );
    }

    const list = listObj.value;
    const result = list
      .lrange(Number(startIdx), Number(lastIdx))
      .map((val: string): RespBulkString => createRespBulkString(val));
    return createRespArray(result);
  }
}
