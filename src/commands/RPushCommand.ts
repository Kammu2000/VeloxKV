import { Command, CommandContext } from "./runtime/Command";
import { Deque } from "../common/utils/deque";
import { createRespInteger, createRespError } from "../protocol/utils";
import { RespValue } from "../protocol/types";
import { VeloxDataType } from "../store/types";

export class RPushCommand implements Command {
  async execute(ctx: CommandContext): Promise<RespValue> {
    const { args, store } = ctx;
    const [listKey, ...elements] = args;

    let list = store.get(listKey);

    if (!list) {
      list = { type: VeloxDataType.LIST, value: new Deque<string>() };
      store.set(listKey, list);
    }

    if (list.type !== VeloxDataType.LIST) {
      return createRespError(
        "Operation against a key holding the wrong kind of value",
      );
    }

    for (const element of elements) {
      list.value.push_back(element);
    }

    return createRespInteger(String(list?.value.size()));
  }
}
