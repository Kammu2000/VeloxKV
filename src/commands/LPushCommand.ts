import { Command, CommandContext } from "./runtime/Command";
import {
  createRespBulkString,
  createRespError,
  createRespInteger,
} from "@protocol/utils";
import { VeloxList } from "@store/values/VeloxList";
import { VeloxStore } from "@store/VeloxStore";
import { VeloxDataType } from "@store/types";
import { RespValue } from "@protocol/types";

export class LPushCommand implements Command {
  async execute(ctx: CommandContext): Promise<RespValue> {
    const { args, store } = ctx;
    const [listKey, ...elements] = args;

    let listObj = store.get(listKey);

    if (!listObj) {
      listObj = {
        type: VeloxDataType.LIST,
        value: new VeloxList<string>(),
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
    list: VeloxList<string>,
    listKey: string,
    store: VeloxStore,
  ): void {
    const waitingList = store.listWaitingMap.get(listKey);
    const waiter = waitingList?.pop();

    if (waiter) {
      const value = list.lpop();

      if (list.isEmpty()) {
        store.del(listKey);
      }

      waiter.operation.complete(createRespBulkString(value));
    }
  }
}
