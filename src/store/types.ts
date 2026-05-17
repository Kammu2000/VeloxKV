import { WaitToken } from "../server/connections/utils/WaitToken";
import { VeloxList } from "./values/VeloxList";

export enum VeloxDataType {
  STRING = "string",
  LIST = "list",
}

export interface VeloxStringValue {
  type: VeloxDataType.STRING;
  value: string;
}

export interface VeloxListValue {
  type: VeloxDataType.LIST;
  value: VeloxList<string, WaitToken>;
}

export type VeloxValue = VeloxStringValue | VeloxListValue;
