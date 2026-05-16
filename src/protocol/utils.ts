import {
  RespArray,
  RespBulkString,
  RespError,
  RespInt,
  RespNull,
  RespSimpleString,
  RespType,
  RespValue,
} from "./types";
import { VeloxDataType, VeloxValue } from "../store/types";

export const createRespSimpleString = (value: string): RespSimpleString => {
  return {
    type: RespType.SIMPLE_STRING,
    value,
  };
};

export const createRespBulkString = (value: string): RespBulkString => {
  return {
    type: RespType.BULK_STRING,
    value,
  };
};

export const createRespInteger = (value: string): RespInt => {
  return {
    type: RespType.INTEGER,
    value,
  };
};

export const createRespArray = (value: RespValue[]): RespArray => {
  return {
    type: RespType.ARRAY,
    value,
  };
};

export const createRespError = (message: string): RespError => {
  return {
    type: RespType.ERROR,
    value: message,
  };
};

export const createRespNull = (): RespNull => {
  return {
    type: RespType.NULL,
  };
};

export const getRespValue = (value: VeloxValue): RespValue => {
  switch (value.type) {
    case VeloxDataType.STRING: {
      return createRespBulkString(value.value);
    }

    case VeloxDataType.LIST:
    case VeloxDataType.SET: {
      return createRespArray(
        [...value.value].map(
          (val: string): RespBulkString => createRespBulkString(val),
        ),
      );
    }
  }
};
