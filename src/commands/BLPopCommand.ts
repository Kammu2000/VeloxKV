import { Command, CommandContext } from "./runtime/Command";
import { createRespError, createRespInteger } from "@protocol/utils";
import { BlockedOperation } from "@server/connections/utils/BlockedOperation";
import { WaitToken } from "@server/connections/utils/WaitToken";
import { FastQueue } from "@common/utils/FastQueue";
import { VeloxDataType } from "@store/types";
import { RespValue } from "@protocol/types";

export class BLPopCommand implements Command {
  async execute(ctx: CommandContext): Promise<RespValue> {
    const { args, store, connection } = ctx;
    const keys = args.slice(0, -1);
    const timeoutMs = args[args.length - 1];

    // case-1: if any of the list is non-empty then return the value by popping first element
    for (const key of keys) {
      const listObj = store.get(key);

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
          store.del(key);
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
      timeoutMs ? Number(timeoutMs) : undefined,
    );

    connection.setBlockedOperation(blockingOp);

    for (const key of keys) {
      let waitingList = store.listWaitingMap.get(key);

      if (!waitingList) {
        waitingList = new FastQueue<WaitToken>();
        store.listWaitingMap.set(key, waitingList);
      }

      const waitToken = new WaitToken(waitingList, blockingOp);

      waitingList.push(waitToken);
      blockingOp.addToken(waitToken);
    }

    return await blockingOp.promise;
  }
}
