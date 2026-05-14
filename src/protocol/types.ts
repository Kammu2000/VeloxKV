export enum RespType {
  SIMPLE_STRING = "simple-string",
  BULK_STRING = "bulk-string",
  INTEGER = "integer",
  ARRAY = "array",
  ERROR = "error",
  NULL = "null",
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

export interface RespNull {
  type: RespType.NULL;
}

export type RespValue =
  | RespSimpleString
  | RespBulkString
  | RespInt
  | RespError
  | RespNull
  | RespArray;

export interface RespArray {
  type: RespType.ARRAY;
  value: RespValue[];
}
