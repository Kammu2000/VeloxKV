import { BlockedOperation } from "./BlockedOperation";
import { FastQueue } from "@common/utils/FastQueue";
import { VeloxList } from "@store/values/VeloxList";
import { VeloxStream } from "@store/values/VeloxStream";
import { VeloxDataType } from "@store/types";
import { createRespBulkString } from "@protocol/utils";
import { createXReadRespResponse } from "@store/values/utils/streamUtils";
import { isListWaitingContext, isStreamWaitingContext } from "./types";

export class BlockingManager {
  private listWaitingMap = new Map<string, FastQueue<BlockedOperation>>();
  private streamWaitingMap = new Map<string, Set<BlockedOperation>>();

  addOperation(
    op: BlockedOperation,
    key: string,
    dataType: VeloxDataType,
  ): void {
    switch (dataType) {
      case VeloxDataType.LIST: {
        let waitingGroup = this.listWaitingMap.get(key);

        if (!waitingGroup) {
          waitingGroup = new FastQueue<BlockedOperation>();
          this.listWaitingMap.set(key, waitingGroup);
        }

        waitingGroup.push(op);
        break;
      }

      case VeloxDataType.STREAM: {
        let waitingGroup = this.streamWaitingMap.get(key);

        if (!waitingGroup) {
          waitingGroup = new Set<BlockedOperation>();
          this.streamWaitingMap.set(key, waitingGroup);
        }

        waitingGroup.add(op);
        break;
      }

      default:
        break;
    }
  }

  removeOperation(
    op: BlockedOperation,
    key: string,
    dataType: VeloxDataType,
  ): void {
    switch (dataType) {
      case VeloxDataType.LIST: {
        const waitingGroup = this.listWaitingMap.get(key);

        if (waitingGroup) {
          waitingGroup.delete(op);
        }
        break;
      }

      case VeloxDataType.STREAM: {
        const waitingGroup = this.streamWaitingMap.get(key);

        if (waitingGroup) {
          waitingGroup.delete(op);
        }
        break;
      }

      default:
        break;
    }
  }

  onListAppend(key: string, list: VeloxList<string>): void {
    const waitingGroup = this.listWaitingMap.get(key);

    if (!waitingGroup || waitingGroup.isEmpty()) {
      return;
    }

    const value = list.lpop();
    const blockedOp = waitingGroup.pop() as BlockedOperation;

    const waitContext = blockedOp.getWaitContext();

    if (isListWaitingContext(waitContext)) {
      for (const listKey of waitContext.keys) {
        this.removeOperation(blockedOp, listKey, VeloxDataType.LIST);
      }

      blockedOp.complete(createRespBulkString(value));
    }
  }

  onStreamAppend(key: string, stream: VeloxStream): void {
    const waitingGroup = this.streamWaitingMap.get(key);

    if (!waitingGroup || waitingGroup.size === 0) {
      return;
    }

    for (const blockedOp of [...waitingGroup]) {
      const waitContext = blockedOp.getWaitContext();

      if (isStreamWaitingContext(waitContext)) {
        const lastSeenId = waitContext.streams[key];
        const entries = stream.after(lastSeenId);

        if (entries.length === 0) {
          continue;
        }

        for (const streamKey of Object.keys(waitContext.streams)) {
          this.removeOperation(blockedOp, streamKey, VeloxDataType.STREAM);
        }

        blockedOp.complete(createXReadRespResponse({ [key]: entries }));
      }
    }
  }
}
