import {
  createRespArray,
  createRespBulkString,
  createRespError,
  createRespNull,
} from "../protocol/utils";
import { Command, CommandContext } from "./runtime/Command";
import { VeloxDataType } from "../store/types";
import { RespValue } from "../protocol/types";

export class LRangeCommand implements Command {
  async execute(ctx: CommandContext): Promise<RespValue> {
    const { args, store } = ctx;
    const [listKey, startIdx, lastIdx] = args;

    let list = store.get(listKey);

    if (!list || !startIdx || !lastIdx) {
      return createRespArray([]);
    }

    if (list.type !== VeloxDataType.LIST) {
      return createRespError(
        "Operation against a key holding the wrong kind of value",
      );
    }

    const start = list.value.adaptIndex(Number(startIdx));
    const end = list.value.adaptIndex(Number(lastIdx));

    console.log(start, end, startIdx, lastIdx);

    if (start > end) {
      return createRespNull();
    }

    const result: RespValue[] = [];

    for (let i = start; i <= end; i++) {
      const val = list.value.at(i);

      if (val) {
        result.push(createRespBulkString(val));
      }
    }

    return createRespArray(result);
  }
}
