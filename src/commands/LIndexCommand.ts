import { Command, CommandContext } from "./runtime/Command";
import {
  createRespNull,
  createRespError,
  createRespBulkString,
} from "../protocol/utils";
import { VeloxDataType } from "../store/types";
import { RespValue } from "../protocol/types";

export class LIndexCommand implements Command {
  async execute(ctx: CommandContext): Promise<RespValue> {
    const { args, store } = ctx;
    const [listKey, idx] = args;

    const list = store.get(listKey);

    if (!list || !idx) {
      return createRespNull();
    }

    if (list.type !== VeloxDataType.LIST) {
      return createRespError(
        "Operation against a key holding the wrong kind of value",
      );
    }

    const value = list.value.at(Number(idx));

    if (!value) {
      return createRespNull();
    }

    return createRespBulkString(value);
  }
}
