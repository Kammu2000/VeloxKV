import { StreamEntryId } from "@store/values/VeloxStream";
import { VeloxDataType } from "@store/types";

export interface ListWaitContext {
  type: VeloxDataType.LIST;
  keys: string[];
}

export interface StreamWaitContext {
  type: VeloxDataType.STREAM;
  streams: Record<string, StreamEntryId>; // key -> lastSeenId
}

export type WaitContext = ListWaitContext | StreamWaitContext;

export const isStreamWaitingContext = (
  waitContext: WaitContext,
): waitContext is StreamWaitContext => {
  return waitContext.type === VeloxDataType.STREAM;
};

export const isListWaitingContext = (
  waitContext: WaitContext,
): waitContext is ListWaitContext => {
  return waitContext.type === VeloxDataType.LIST;
};
