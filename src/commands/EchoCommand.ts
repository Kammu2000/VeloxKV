import { Command, CommandContext } from "./runtime/Command";
import { createRespBulkString } from "../protocol/utils";
import { RespValue } from "../protocol/types";

export class EchoCommand implements Command {
  async execute(ctx: CommandContext): Promise<RespValue> {
    const { args } = ctx;
    return createRespBulkString(args[0]);
  }
}
