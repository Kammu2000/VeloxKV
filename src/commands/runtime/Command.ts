import { RespValue } from "../../protocol/types";

export interface CommandContext {
  args: string[];
}

export interface Command {
  execute(ctx: CommandContext): Promise<RespValue>;
}

export enum CommandType {
  PING = "PING",
  ECHO = "ECHO",
  GET = "GET",
  SET = "SET",
  DEL = "DEL",
  EXISTS = "EXISTS",
}
