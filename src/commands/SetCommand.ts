import { Command, CommandContext } from "./runtime/Command";
import {
  createRespError,
  createRespSimpleString,
  isString,
} from "../protocol/utils";
import { RespValue } from "../protocol/types";
import { VeloxDataType } from "../store/types";

export class SetCommand implements Command {
  async execute(ctx: CommandContext): Promise<RespValue> {
    const { args, store } = ctx;
    const [key, value] = args;

    if (!isString(key) || !isString(value)) {
      return createRespError("please provide a valid key and value");
    }

    store.set(key, { type: VeloxDataType.STRING, value });
    return createRespSimpleString("OK");
  }
}
