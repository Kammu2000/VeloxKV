import { Command, CommandContext } from "./runtime/Command";
import { createRespSimpleString } from "../protocol/utils";
import { RespValue } from "../protocol/types";
import { VeloxDataType } from "../store/types";

export class SetCommand implements Command {
  async execute(ctx: CommandContext): Promise<RespValue> {
    const { args, store } = ctx;
    const [key, value] = args;

    store.set(key, { type: VeloxDataType.STRING, value });
    return createRespSimpleString("OK");
  }
}
