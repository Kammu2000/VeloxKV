import { Command, CommandContext } from "./runtime/Command";
import { createRespNull, getRespValue } from "../protocol/utils";
import { RespValue } from "../protocol/types";

export class GetCommand implements Command {
  async execute(ctx: CommandContext): Promise<RespValue> {
    const { args, store } = ctx;
    const key = args[0];

    const storedValue = store.get(key);

    if (!storedValue) {
      return createRespNull();
    }

    return getRespValue(storedValue);
  }
}
