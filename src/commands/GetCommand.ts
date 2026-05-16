import { Command, CommandContext } from "./runtime/Command";
import {
  createRespNull,
  createRespBulkString,
  createRespError,
} from "../protocol/utils";
import { RespValue } from "../protocol/types";
import { VeloxDataType } from "../store/types";

export class GetCommand implements Command {
  async execute(ctx: CommandContext): Promise<RespValue> {
    const { args, store } = ctx;
    const key = args[0];

    const storedValue = store.get(key);

    if (!storedValue) {
      return createRespNull();
    }

    if (storedValue.type === VeloxDataType.STRING)
      return createRespBulkString(storedValue.value);

    return createRespError("value is not a string");
  }
}
