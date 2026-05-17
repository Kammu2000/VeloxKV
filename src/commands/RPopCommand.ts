import {
  createRespError,
  createRespInteger,
  createRespNull,
} from "../protocol/utils";
import { Command, CommandContext } from "./runtime/Command";
import { VeloxDataType } from "../store/types";
import { RespValue } from "../protocol/types";

export class RPopCommand implements Command {
  async execute(ctx: CommandContext): Promise<RespValue> {
    const { args, store } = ctx;
    const [listKey] = args;

    const listObj = store.get(listKey);

    if (!listObj) {
      return createRespNull();
    }

    if (listObj.type !== VeloxDataType.LIST) {
      return createRespError(
        "Operation against a key holding the wrong kind of value",
      );
    }

    const list = listObj.value;
    const value = list.rpop();

    if (list.isEmpty()) {
      store.del(listKey);
    }

    return createRespInteger(String(value));
  }
}
