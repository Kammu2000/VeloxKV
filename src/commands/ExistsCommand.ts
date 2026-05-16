import { Command, CommandContext } from "./runtime/Command";
import { createRespInteger } from "../protocol/utils";
import { RespValue } from "../protocol/types";

export class ExistsCommand implements Command {
  async execute(ctx: CommandContext): Promise<RespValue> {
    const { args, store } = ctx;
    let cnt = 0;

    for (const arg of args) {
      if (store.has(arg)) {
        cnt++;
      }
    }

    return createRespInteger(String(cnt));
  }
}
