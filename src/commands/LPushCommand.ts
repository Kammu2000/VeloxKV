import {
  createRespBulkString,
  createRespError,
  createRespInteger,
} from "../protocol/utils";
import { VeloxList } from "../store/values/VeloxList";
import { WaitToken } from "../server/connections/utils/WaitToken";
import { Command, CommandContext } from "./runtime/Command";
import { VeloxDataType } from "../store/types";
import { RespValue } from "../protocol/types";
import { VeloxStore } from "../store/VeloxStore";

export class LPushCommand implements Command {
  async execute(ctx: CommandContext): Promise<RespValue> {
    const { args, store } = ctx;
    const [listKey, ...elements] = args;

    let listObj = store.get(listKey);

    if (!listObj) {
      listObj = {
        type: VeloxDataType.LIST,
        value: new VeloxList<string, WaitToken>(),
      };
      store.set(listKey, listObj);
    }

    if (listObj.type !== VeloxDataType.LIST) {
      return createRespError(
        "Operation against a key holding the wrong kind of value",
      );
    }

    const list = listObj.value;

    for (const element of elements) {
      list.lpush(element);
    }

    this.notifyWaiter(list, listKey, store);
    return createRespInteger(String(list.size()));
  }

  private notifyWaiter(
    list: VeloxList<string, WaitToken>,
    listKey: string,
    store: VeloxStore,
  ): void {
    const waiter = list.getNextWaiter();

    if (waiter) {
      const value = list.lpop();

      if (list.isEmpty()) {
        store.del(listKey);
      }

      waiter.operation.complete(createRespBulkString(value));
    }
  }
}
