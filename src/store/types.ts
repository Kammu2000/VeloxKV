import { Deque } from "../common/utils/deque";

export enum VeloxDataType {
  STRING = "string",
  LIST = "list",
  SET = "set",
}

export interface VeloxStringValue {
  type: VeloxDataType.STRING;
  value: string;
}

export interface VeloxListValue {
  type: VeloxDataType.LIST;
  value: Deque<string>;
}

export interface VeloxSetValue {
  type: VeloxDataType.SET;
  value: Set<string>;
}

export type VeloxValue = VeloxStringValue | VeloxListValue | VeloxSetValue;
