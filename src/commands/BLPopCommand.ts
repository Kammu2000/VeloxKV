import { Command, CommandContext } from "./runtime/Command";
import {
  createRespError,
  createRespInteger,
  createRespNull,
} from "@protocol/utils";
import { BlockedOperation } from "@blocking/BlockedOperation";
import { VeloxDataType } from "@store/types";
import { RespValue } from "@protocol/types";

export class BLPopCommand implements Command {
  async execute(ctx: CommandContext): Promise<RespValue> {
    const { args, server, client } = ctx;
    const keys = args.slice(0, -1);
    const timeoutMs = args[args.length - 1];

    // case-1: if any of the list is non-empty then return the value by popping first element
    for (const key of keys) {
      const listObj = server.store.get(key);

      if (!listObj) {
        continue;
      }

      if (listObj.type !== VeloxDataType.LIST) {
        return createRespError(
          "Operation against a key holding the wrong kind of value",
        );
      }

      const list = listObj.value;

      if (!list.isEmpty()) {
        const value = list.lpop();

        if (list.isEmpty()) {
          server.store.del(key);
        }

        return createRespInteger(value);
      }
    }

    // case-2: all of the lists are empty so we block code logically using await on promise which will be resolved after timeout
    // with null or with any value pushed to any of the list through lpush or rpush comamnds

    // Design Decision: we are using only single thread and taking advantage of async runtime of javascript which is not possible in C++ / java.
    // In languages like C++/Java,  you need to use multithreading to produce async runtime which will not scale when threads
    // grows to very high number because each thread occupies certain amount of memory so memory explodes with the number of threads.
    // Redis is also single threaded and it has implemented async runtime in C++ by keeping single thread similar to nodejs using event loop
    const blockingOp = new BlockedOperation(
      { type: VeloxDataType.LIST, keys },
      timeoutMs ? Number(timeoutMs) : undefined,
      createRespNull(),
    );

    for (const key of keys) {
      server.blockingManager.addOperation(blockingOp, key, VeloxDataType.LIST);
    }

    client.session.setBlockedOperation(blockingOp);

    const result = await blockingOp.promise;
    client.session.setBlockedOperation(undefined);
    return result;
  }
}
