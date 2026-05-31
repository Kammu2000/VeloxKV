import { VeloxList } from "./values/VeloxList";
import { VeloxStream } from "./values/VeloxStream";

export enum VeloxDataType {
  STRING = "string",
  LIST = "list",
  STREAM = "stream",
}

export interface VeloxStringValue {
  type: VeloxDataType.STRING;
  value: string;
}

export interface VeloxListValue {
  type: VeloxDataType.LIST;
  value: VeloxList<string>;
}

export interface VeloxStreamValue {
  type: VeloxDataType.STREAM;
  value: VeloxStream;
}

export type VeloxValue = VeloxStringValue | VeloxListValue | VeloxStreamValue;
