import { ClientSession } from "@client/ClientSession";
import { RespValue } from "@protocol/types";
import { ServerContext } from "@server/ServerContext";

export interface CommandContext {
  args: string[];
  server: ServerContext;
  session: ClientSession;
}

export interface Command {
  execute(ctx: CommandContext): Promise<RespValue>;
}

export enum CommandType {
  COMMAND = "COMMAND",
  PING = "PING",
  ECHO = "ECHO",
  GET = "GET",
  SET = "SET",
  DEL = "DEL",
  EXISTS = "EXISTS",
  LPUSH = "LPUSH",
  RPUSH = "RPUSH",
  LPOP = "LPOP",
  RPOP = "RPOP",
  LLEN = "LLEN",
  LINDEX = "LINDEX",
  LRANGE = "LRANGE",
  BLPOP = "BLPOP",
  SUBSCRIBE = "SUBSCRIBE",
  UNSUBSCRIBE = "UNSUBSCRIBE",
  PUBLISH = "PUBLISH",
}
