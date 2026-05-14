import { CRLF } from "../common/constants";
import { RespType, RespValue } from "./types";

export class RespSerializer {
  serialize(value: RespValue): string {
    switch (value.type) {
      case RespType.SIMPLE_STRING:
        return `${value.value}${CRLF}`;

      case RespType.BULK_STRING: {
        const val = value.value;
        return `*${val.length}${CRLF}${val}${CRLF}`;
      }

      case RespType.INTEGER: {
        return `:${value.value}${CRLF}`;
      }

      case RespType.ERROR: {
        return `-ERR ${value.value}${CRLF}`;
      }

      case RespType.ARRAY: {
        const val = value.value;
        return `*${val.length}${CRLF}${val.map((respValue: RespValue): string => this.serialize(respValue)).join("")}`;
      }
    }
  }
}
