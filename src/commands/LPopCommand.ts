import {
  createRespError,
  createRespInteger,
  createRespNull,
} from "../protocol/utils";
import { Command, CommandContext } from "./runtime/Command";
import { VeloxDataType } from "../store/types";
import { RespValue } from "../protocol/types";

export class LPopCommand implements Command {
  async execute(ctx: CommandContext): Promise<RespValue> {
    const { args, store } = ctx;
    const [listKey] = args;

    let list = store.get(listKey);

    if (!list) {
      return createRespNull();
    }

    if (list.type !== VeloxDataType.LIST) {
      return createRespError(
        "Operation against a key holding the wrong kind of value",
      );
    }

    const value = list.value.pop_front();
    return createRespInteger(String(value));
  }
}
