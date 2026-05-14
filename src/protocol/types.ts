export enum RespType {
  SIMPLE_STRING = "simple-string",
  BULK_STRING = "bulk-string",
  INTEGER = "integer",
  ARRAY = "array",
  ERROR = "error",
}

export interface RespSimpleString {
  type: RespType.SIMPLE_STRING;
  value: string;
}

export interface RespBulkString {
  type: RespType.BULK_STRING;
  value: string;
}

export interface RespInt {
  type: RespType.INTEGER;
  value: string;
}

export interface RespError {
  type: RespType.ERROR;
  value: string;
}

export type RespValue =
  | RespSimpleString
  | RespBulkString
  | RespInt
  | RespError
  | RespArray;

export interface RespArray {
  type: RespType.ARRAY;
  value: RespValue[];
}
