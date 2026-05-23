import {
  createRespError,
  createRespInteger,
  createRespNull,
} from "@protocol/utils";
import { Command, CommandContext } from "./runtime/Command";
import { VeloxDataType } from "@store/types";
import { RespValue } from "@protocol/types";

export class LPopCommand implements Command {
  async execute(ctx: CommandContext): Promise<RespValue> {
    const { args, server } = ctx;
    const [listKey] = args;

    const listObj = server.store.get(listKey);

    if (!listObj) {
      return createRespNull();
    }

    if (listObj.type !== VeloxDataType.LIST) {
      return createRespError(
        "Operation against a key holding the wrong kind of value",
      );
    }

    const list = listObj.value;
    const value = list.lpop();

    if (list.isEmpty()) {
      server.store.del(listKey);
    }

    return createRespInteger(String(value));
  }
}
