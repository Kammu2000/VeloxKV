import { Command, CommandContext } from "./runtime/Command";
import {
  createRespBulkString,
  createRespError,
  createRespInteger,
} from "@protocol/utils";
import { VeloxList } from "@store/values/VeloxList";
import { ServerContext } from "@server/ServerContext";
import { VeloxDataType } from "@store/types";
import { RespValue } from "@protocol/types";

export class LPushCommand implements Command {
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
      list.lpush(element);
    }

    this.notifyWaiter(list, listKey, server);
    return createRespInteger(String(list.size()));
  }

  private notifyWaiter(
    list: VeloxList<string>,
    listKey: string,
    server: ServerContext,
  ): void {
    const waitingQueue = server.blockingManager.getWaitingQueue(listKey);
    const waiter = waitingQueue?.pop();

    if (waiter) {
      const value = list.lpop();

      if (list.isEmpty()) {
        server.store.del(listKey);
      }

      waiter.operation.complete(createRespBulkString(value));
    }
  }
}
