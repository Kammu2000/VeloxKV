import { Command, CommandContext } from "./runtime/Command";
import { createRespError, createRespInteger } from "@protocol/utils";
import { VeloxList } from "@store/values/VeloxList";
import { VeloxDataType } from "@store/types";
import { RespValue } from "@protocol/types";

export class RPushCommand implements Command {
  async execute(ctx: CommandContext): Promise<RespValue> {
    const { args, server } = ctx;
    const [listKey, ...elements] = args;

    let listObj = server.store.get(listKey);

    if (!listObj) {
      listObj = {
        type: VeloxDataType.LIST,
        value: new VeloxList<string>(),
      };
      server.store.set(listKey, listObj);
    }

    if (listObj.type !== VeloxDataType.LIST) {
      return createRespError(
        "Operation against a key holding the wrong kind of value",
      );
    }

    const list = listObj.value;

    for (const element of elements) {
      list.rpush(element);
    }

    server.blockingManager.onListAppend(listKey, list);
    return createRespInteger(String(list.size()));
  }
}
