import { Command, CommandContext } from "./runtime/Command";
import { createRespSimpleString } from "../protocol/utils";
import { RespValue } from "../protocol/types";

export class PingCommand implements Command {
  async execute(_ctx: CommandContext): Promise<RespValue> {
    return createRespSimpleString("PONG");
  }
}
