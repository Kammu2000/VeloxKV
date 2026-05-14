import { RespValue } from "../protocol/types";

export interface CommandContext {
  args: string[];
}

export interface Command {
  execute(ctx: CommandContext): Promise<RespValue>;
}
