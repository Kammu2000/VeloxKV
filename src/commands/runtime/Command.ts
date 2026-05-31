import { ClientRespWriter } from "@client/ClientRespWriter";
import { ClientSession } from "@client/ClientSession";
import { ServerContext } from "@server/ServerContext";
import { RespValue } from "@protocol/types";

export interface CommandContext {
  args: string[];
  server: ServerContext;
  client: {
    session: ClientSession;
    respWriter: ClientRespWriter;
  };
}

export interface Command {
  execute(ctx: CommandContext): Promise<RespValue | void>;
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
  XADD = "XADD",
  XRANGE = "XRANGE",
}
