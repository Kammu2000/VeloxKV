import { Command, CommandContext } from "./runtime/Command";
import { createRespInteger } from "@protocol/utils";
import { RespValue } from "@protocol/types";

export class DelCommand implements Command {
  async execute(ctx: CommandContext): Promise<RespValue> {
    const { args, server } = ctx;
    let cnt = 0;

    for (const arg of args) {
      if (server.store.has(arg)) {
        server.store.del(arg);
        cnt++;
      }
    }

    return createRespInteger(String(cnt));
  }
}
